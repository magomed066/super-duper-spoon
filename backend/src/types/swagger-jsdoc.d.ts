declare module 'swagger-jsdoc' {
  interface SwaggerDefinition {
    openapi: string
    info: {
      title: string
      version: string
      description?: string
    }
    servers?: Array<{
      url: string
      description?: string
    }>
    tags?: Array<{
      name: string
      description?: string
    }>
  }

  interface SwaggerOptions {
    definition: SwaggerDefinition
    apis?: string[]
  }

  interface OpenApiDocument {
    [key: string]: unknown
  }

  export default function swaggerJSDoc(options?: SwaggerOptions): OpenApiDocument
}
