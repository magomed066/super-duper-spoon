import express, {
  type NextFunction,
  type Request,
  type Response
} from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import { errorHandler } from './common/middleware/error-handler.middleware.js'
import { swaggerSpec } from './config/swagger.js'
import { applicationsRouter } from './modules/applications/applications.routes.js'
import { authRouter } from './modules/auth/auth.routes.js'
import { restaurantsRouter } from './modules/restaurants/restaurant.routes.js'
import { usersRouter } from './modules/users/users.routes.js'

export const createApp = (): express.Express => {
  const app = express()
  const apiPrefix = '/api'

  app.use(cors())
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))

  app.get(apiPrefix, (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok'
    })
  })

  app.use(`${apiPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get(`${apiPrefix}/docs.json`, (_req, res) => {
    res.json(swaggerSpec)
  })

  app.use(`${apiPrefix}/auth`, authRouter)
  app.use(`${apiPrefix}/applications`, applicationsRouter)
  app.use(`${apiPrefix}/restaurants`, restaurantsRouter)
  app.use(`${apiPrefix}/users`, usersRouter)

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(
      Object.assign(new Error('Route not found'), {
        statusCode: 404
      })
    )
  })

  app.use(errorHandler)

  return app
}
