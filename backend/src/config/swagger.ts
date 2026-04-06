import swaggerJSDoc from 'swagger-jsdoc'

const PORT = Number(process.env.PORT ?? 3000)

const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Restaurant Management API',
      version: '1.0.0',
      description:
        'Backend API documentation for the restaurant management system.'
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
            },
            user: {
              $ref: '#/components/schemas/User'
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
              example: 'owner@sunrise.example'
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
              enum: ['SYSTEM_OWNER', 'CLIENT', 'STAFF'],
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
        },
        RestaurantWorkScheduleItem: {
          type: 'object',
          required: ['day', 'open', 'close'],
          properties: {
            day: {
              type: 'string',
              example: 'Monday'
            },
            open: {
              type: 'string',
              example: '09:00'
            },
            close: {
              type: 'string',
              example: '22:00'
            }
          }
        },
        Restaurant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              example: 'Sunrise Cafe'
            },
            slug: {
              type: 'string',
              example: 'sunrise-cafe'
            },
            cuisine: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['European', 'Breakfast']
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'sunrise-cafe@restaurant.local'
            },
            phones: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['+79991234567']
            },
            city: {
              type: 'string',
              example: 'Moscow'
            },
            logo: {
              type: 'string',
              example: 'https://cdn.example.com/restaurants/sunrise/logo.png'
            },
            preview: {
              type: 'string',
              example: 'https://cdn.example.com/restaurants/sunrise/preview.png'
            },
            workSchedule: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/RestaurantWorkScheduleItem'
              }
            },
            deliveryTime: {
              type: 'integer',
              example: 45
            },
            deliveryConditions: {
              type: 'string',
              example: 'Free delivery for orders over 1500 RUB'
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'All-day breakfast and specialty coffee.'
            },
            phone: {
              type: 'string',
              nullable: true,
              example: '+79991234567'
            },
            address: {
              type: 'string',
              nullable: true,
              example: '1 Tverskaya Street, Moscow'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        RestaurantMembershipUser: {
          allOf: [
            {
              $ref: '#/components/schemas/User'
            }
          ]
        },
        RestaurantMembership: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            restaurantId: {
              type: 'string',
              format: 'uuid'
            },
            userId: {
              type: 'string',
              format: 'uuid'
            },
            role: {
              type: 'string',
              enum: ['OWNER', 'MANAGER'],
              example: 'MANAGER'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            user: {
              $ref: '#/components/schemas/RestaurantMembershipUser'
            }
          }
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              example: 1
            },
            limit: {
              type: 'integer',
              example: 10
            },
            total: {
              type: 'integer',
              example: 42
            },
            totalPages: {
              type: 'integer',
              example: 5
            },
            hasNextPage: {
              type: 'boolean',
              example: true
            },
            hasPreviousPage: {
              type: 'boolean',
              example: false
            }
          }
        },
        PaginatedRestaurantsResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Restaurant'
              }
            },
            pagination: {
              $ref: '#/components/schemas/PaginationMeta'
            }
          }
        },
        CreateRestaurantRequest: {
          type: 'object',
          required: ['name', 'phone', 'address', 'description'],
          properties: {
            name: {
              type: 'string',
              example: 'Sunrise Cafe'
            },
            slug: {
              type: 'string',
              example: 'sunrise-cafe',
              description: 'Optional. Generated from name when omitted.'
            },
            phone: {
              type: 'string',
              example: '+79991234567'
            },
            address: {
              type: 'string',
              example: '1 Tverskaya Street, Moscow'
            },
            description: {
              type: 'string',
              example: 'All-day breakfast and specialty coffee.'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'info@sunrise.example'
            },
            phones: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['+79991234567', '+79997654321']
            },
            city: {
              type: 'string',
              example: 'Moscow'
            },
            logo: {
              type: 'string',
              example: 'https://cdn.example.com/restaurants/sunrise/logo.png'
            },
            preview: {
              type: 'string',
              example: 'https://cdn.example.com/restaurants/sunrise/preview.png'
            },
            deliveryTime: {
              type: 'integer',
              example: 45
            },
            deliveryConditions: {
              type: 'string',
              example: 'Free delivery for orders over 1500 RUB'
            },
            cuisine: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['European', 'Breakfast']
            },
            workSchedule: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/RestaurantWorkScheduleItem'
              }
            }
          }
        },
        UpdateRestaurantRequest: {
          type: 'object',
          minProperties: 1,
          properties: {
            name: {
              type: 'string',
              example: 'Sunrise Cafe'
            },
            slug: {
              type: 'string',
              example: 'sunrise-cafe'
            },
            phone: {
              type: 'string',
              example: '+79991234567'
            },
            address: {
              type: 'string',
              example: '1 Tverskaya Street, Moscow'
            },
            description: {
              type: 'string',
              example: 'All-day breakfast and specialty coffee.'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'info@sunrise.example'
            },
            phones: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            city: {
              type: 'string',
              example: 'Moscow'
            },
            logo: {
              type: 'string',
              example: 'https://cdn.example.com/restaurants/sunrise/logo.png'
            },
            preview: {
              type: 'string',
              example: 'https://cdn.example.com/restaurants/sunrise/preview.png'
            },
            deliveryTime: {
              type: 'integer',
              example: 45
            },
            deliveryConditions: {
              type: 'string',
              example: 'Free delivery for orders over 1500 RUB'
            },
            cuisine: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            workSchedule: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/RestaurantWorkScheduleItem'
              }
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        CreateRestaurantResponse: {
          type: 'object',
          properties: {
            restaurant: {
              $ref: '#/components/schemas/Restaurant'
            },
            membership: {
              $ref: '#/components/schemas/RestaurantMembership'
            }
          }
        },
        AssignRestaurantManagerRequest: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: {
              type: 'string',
              format: 'uuid'
            }
          }
        }
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
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
