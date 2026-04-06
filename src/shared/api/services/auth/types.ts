export enum UserRole {
  OWNER = 'OWNER',
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER'
}

export type User = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type UserLogin = {
  email: string
  password: string
}

export type UserRegister = Pick<
  User,
  'firstName' | 'lastName' | 'phone' | 'email'
> & {
  password: string
}

export type UserLoginResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export type AuthRegisterResponse = {
  message: string
}

export type LogoutPayload = {
  refreshToken: string
}
