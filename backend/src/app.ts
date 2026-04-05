import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import { errorHandler } from './common/middleware/error-handler.middleware.js'
import { swaggerSpec } from './config/swagger.js'
import { applicationsRouter } from './modules/applications/applications.routes.js'
import { authRouter } from './modules/auth/auth.routes.js'

export const createApp = (): express.Express => {
  const app = express()

  app.use(cors())

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/docs.json', (_req, res) => {
    res.json(swaggerSpec)
  })

  app.use('/auth', authRouter)
  app.use('/applications', applicationsRouter)

  app.use(errorHandler)

  return app
}
