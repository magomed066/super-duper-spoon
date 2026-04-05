import swaggerJSDoc from 'swagger-jsdoc'

const PORT = Number(process.env.PORT ?? 3000)

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Restaurant Management API',
      version: '1.0.0',
      description: 'Backend API documentation for the restaurant management system.'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Service health and basic availability endpoints'
      }
    ]
  },
  apis: ['./src/**/*.ts']
})
