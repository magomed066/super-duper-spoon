import express from 'express'
import cors from 'cors'

import { errorHandler } from './common/middleware/error-handler.middleware.js'

export const createApp = (): express.Express => {
  const app = express()

  app.use(cors())

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))

  app.use(errorHandler)

  return app
}
