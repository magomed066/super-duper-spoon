import type { User } from '../modules/users/entities/user.entity.js'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export {}
