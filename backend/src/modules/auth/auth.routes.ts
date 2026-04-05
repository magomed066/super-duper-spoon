import { Router } from 'express'

import { AuthController } from './auth.controller.js'
import { AuthRepository } from './auth.repository.js'
import { AuthService } from './auth.service.js'

const authRouter = Router()
const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)

authRouter.post('/login', authController.login)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/logout', authController.logout)

export { authRouter }
