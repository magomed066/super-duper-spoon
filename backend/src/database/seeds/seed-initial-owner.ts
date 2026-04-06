import { AppDataSource } from '../data-source.js'
import { UsersService } from '../../modules/users/users.service.js'
import { UserRole } from '../../modules/users/enums/user-role.enum.js'

const DEFAULT_OWNER_EMAIL = 'admin@example.com'
const DEFAULT_OWNER_PASSWORD = 'admin123456'
const DEFAULT_OWNER_PHONE = '+10000000000'

export const seedInitialOwner = async (): Promise<void> => {
  const queryRunner = AppDataSource.createQueryRunner()

  try {
    const hasUsersTable = await queryRunner.hasTable('users')

    if (!hasUsersTable) {
      console.warn('Skipping initial owner seed: users table does not exist yet')
      return
    }
  } finally {
    await queryRunner.release()
  }

  const usersService = new UsersService()
  const email = (process.env.INITIAL_OWNER_EMAIL ?? DEFAULT_OWNER_EMAIL).trim()

  const existingUser = await usersService.findByEmail(email)

  if (existingUser) {
    return
  }

  await usersService.create({
    firstName: (process.env.INITIAL_OWNER_FIRST_NAME ?? 'Admin').trim(),
    lastName: (process.env.INITIAL_OWNER_LAST_NAME ?? 'Owner').trim(),
    phone: (process.env.INITIAL_OWNER_PHONE ?? DEFAULT_OWNER_PHONE).trim(),
    email,
    password: (process.env.INITIAL_OWNER_PASSWORD ?? DEFAULT_OWNER_PASSWORD).trim(),
    role: UserRole.SYSTEM_OWNER,
    status: 'ACTIVE',
    isActive: true
  })

  console.log(`Initial owner created with email: ${email}`)
}
