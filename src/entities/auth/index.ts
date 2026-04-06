export { authHighlights, authStats } from './config/content'

export {
  getFieldErrors,
  signInSchema,
  signUpSchema,
  validateWithZod
} from './model/validation'
export type { SignInFormValues, SignUpFormValues } from './model/validation'
export { AuthInitializer } from './model/init-auth'
export { useAuthStore } from './model/store'
export {
  AuthPermission,
  canAccessRoute,
  getRouteFallback,
  hasPermission
} from './model/rbac'
export {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY
} from './model/storage'
export * from './utils/index'
