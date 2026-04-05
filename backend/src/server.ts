import 'reflect-metadata'
import 'dotenv/config'

import { createApp } from './app.js'
import { AppDataSource } from './database/data-source.js'

const port = Number(process.env.PORT ?? 3000)

const startServer = async (): Promise<void> => {
  const app = createApp()

  AppDataSource.initialize().then(() => {
    console.log('DB is connected')
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start server', error)
  process.exit(1)
})
