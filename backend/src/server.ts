import 'reflect-metadata'
import 'dotenv/config'

import { createApp } from './app.js'
import { env } from './config/index.js'
import { AppDataSource } from './database/data-source.js'
import { seedInitialOwner } from './database/seeds/seed-initial-owner.js'

const PORT = env.port

const startServer = async (): Promise<void> => {
  await AppDataSource.initialize()
  console.log('DB is connected')

  await seedInitialOwner()

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
