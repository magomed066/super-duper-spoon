export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked'
}

export type User = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  status: UserStatus
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
  user: User
}

export type AuthRegisterResponse = {
  message: string
}
