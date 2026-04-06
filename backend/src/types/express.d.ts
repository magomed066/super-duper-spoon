import type { AuthenticatedRequestUser } from '../modules/auth/types/auth.types.js'

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedRequestUser
    }
  }
}

export {}
