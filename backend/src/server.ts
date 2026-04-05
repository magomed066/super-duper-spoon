import 'reflect-metadata'
import 'dotenv/config'

import { createApp } from './app.js'
import { env } from './config/index.js'
import { AppDataSource } from './database/data-source.js'

const PORT = env.port

const startServer = async (): Promise<void> => {
  await AppDataSource.initialize()
  console.log('DB is connected')

  const app = createApp()

  await new Promise<void>((resolve) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      resolve()
    })
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start server', error)
  process.exit(1)
})
