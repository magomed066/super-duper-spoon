import swaggerJSDoc from 'swagger-jsdoc'

const PORT = Number(process.env.PORT ?? 3000)

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Restaurant Management API',
      version: '1.0.0',
      description: 'Backend API documentation for the restaurant management system.'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              example: 'Access denied'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'owner@example.com'
            },
            password: {
              type: 'string',
              example: 'secret123'
            }
          }
        },
        RefreshTokenRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        AuthTokensResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        AccessTokenResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        CreateApplicationRequest: {
          type: 'object',
          required: ['email', 'name', 'restaurantName', 'address', 'phone'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'owner@example.com'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            restaurantName: {
              type: 'string',
              example: 'Sunrise Cafe'
            },
            address: {
              type: 'string',
              example: '1 Tverskaya Street, Moscow'
            },
            phone: {
              type: 'string',
              example: '+79991234567'
            }
          }
        },
        Application: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            email: {
              type: 'string',
              example: 'hashed-email'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            restaurantName: {
              type: 'string',
              example: 'Sunrise Cafe'
            },
            address: {
              type: 'string',
              example: 'hashed-address'
            },
            phone: {
              type: 'string',
              example: 'hashed-phone'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'APPROVED', 'REJECTED'],
              example: 'PENDING'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ApprovalResult: {
          type: 'object',
          properties: {
            application: {
              $ref: '#/components/schemas/Application'
            },
            password: {
              type: 'string',
              example: 'generated-password'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            phone: {
              type: 'string',
              example: '+79991234567'
            },
            email: {
              type: 'string',
              example: 'john@example.com'
            },
            status: {
              type: 'string',
              example: 'ACTIVE'
            },
            role: {
              type: 'string',
              enum: ['OWNER', 'CLIENT', 'MANAGER'],
              example: 'CLIENT'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
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
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Applications',
        description: 'Restaurant application endpoints'
      }
    ]
  },
  apis: ['./src/**/*.ts']
}

export const swaggerSpec = swaggerJSDoc(
  swaggerOptions as Parameters<typeof swaggerJSDoc>[0]
)
