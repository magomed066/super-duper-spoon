export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked'
}

export type User = {
  firstName: string
  lastName: string
  phone: string
  email: string
  password: string
  status: typeof UserStatus
}

export type UserLogin = Pick<User, 'email' | 'password'>

export type UserRegister = Omit<User, 'status'>

export type UserLoginResponse = {
  accessToken: string
  user: User
}
