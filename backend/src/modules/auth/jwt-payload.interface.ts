import { UserStatus } from '../users/entities/user-status.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  status: UserStatus;
  type: 'access' | 'refresh';
}
