import { AppDataSource } from '../../database/data-source.js'
import { hashEmail } from '../../common/utils/encryption.js'
import { User } from '../users/entities/user.entity.js'
import { RefreshToken } from './entities/refresh-token.entity.js'

export class AuthRepository {
  private readonly userRepository = AppDataSource.getRepository(User)

  private readonly refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

  findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: hashEmail(email) }
    })
  }

  findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOne({
      where: { token },
      relations: {
        // Refresh flow needs the owning user immediately to validate account state.
        user: true
      }
    })
  }

  saveRefreshToken(token: string, expiresAt: Date, user: User): Promise<RefreshToken> {
    return this.refreshTokenRepository.save({
      token,
      expiresAt,
      user
    })
  }

  deleteRefreshTokenById(id: string): Promise<void> {
    return this.refreshTokenRepository.delete({ id }).then(() => undefined)
  }

  deleteRefreshTokenByToken(token: string): Promise<void> {
    return this.refreshTokenRepository.delete({ token }).then(() => undefined)
  }
}
