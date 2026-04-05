import 'reflect-metadata'
import 'dotenv/config'

import { createApp } from './app.js'
import { AppDataSource } from './database/data-source.js'
import { Request, Response } from 'express'

const PORT = Number(process.env.PORT ?? 3000)

const startServer = async (): Promise<void> => {
  const app = createApp()

  /**
   * @openapi
   * /api:
   *   get:
   *     tags:
   *       - Health
   *     summary: Check that the API server is running.
   *     responses:
   *       200:
   *         description: API server is available.
   */
  app.get('/api', (_: Request, res: Response) => {
    res.send(`Server has been started on port http://localhost:${PORT}`)
  })

  AppDataSource.initialize().then(() => {
    console.log('DB is connected')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start server', error)
  process.exit(1)
})
