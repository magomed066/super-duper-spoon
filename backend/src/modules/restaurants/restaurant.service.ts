import { z } from 'zod'

import { AppDataSource } from '../../database/data-source.js'
import { User } from '../users/entities/user.entity.js'
import { RestaurantMembershipRole } from './enums/restaurant-membership-role.enum.js'
import { Restaurant } from './entities/restaurant.entity.js'
import { RestaurantUser } from './entities/restaurant-user.entity.js'

const createRestaurantSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255, 'Name is too long'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(255, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug format is invalid'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone is required')
    .max(255, 'Phone is too long'),
  address: z
    .string()
    .trim()
    .min(1, 'Address is required')
    .max(1000, 'Address is too long'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(5000, 'Description is too long')
})

type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>

export class RestaurantsHttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message)
    this.name = 'RestaurantsHttpError'
  }
}

export class RestaurantService {
  async createRestaurant(
    payload: unknown,
    currentUser: User | undefined
  ): Promise<Restaurant> {
    if (!currentUser) {
      throw new RestaurantsHttpError(401, 'User is not authenticated')
    }

    const validationResult = createRestaurantSchema.safeParse(payload)

    if (!validationResult.success) {
      throw new RestaurantsHttpError(
        400,
        validationResult.error.issues[0]?.message ?? 'Invalid restaurant payload'
      )
    }

    const normalizedPayload = validationResult.data
    const generatedEmail = this.buildRestaurantEmail(normalizedPayload.slug)

    return AppDataSource.transaction(async (manager) => {
      const restaurantRepository = manager.getRepository(Restaurant)
      const restaurantUserRepository = manager.getRepository(RestaurantUser)

      const existingRestaurant = await restaurantRepository.findOne({
        where: [{ slug: normalizedPayload.slug }, { email: generatedEmail }]
      })

      if (existingRestaurant) {
        throw new RestaurantsHttpError(409, 'Restaurant slug is already in use')
      }

      const restaurant = restaurantRepository.create(
        this.toRestaurantEntity(normalizedPayload, generatedEmail)
      )

      const savedRestaurant = await restaurantRepository.save(restaurant)

      const membership = restaurantUserRepository.create({
        restaurantId: savedRestaurant.id,
        userId: currentUser.id,
        role: RestaurantMembershipRole.OWNER,
        isActive: true
      })

      await restaurantUserRepository.save(membership)

      return savedRestaurant
    })
  }

  private buildRestaurantEmail(slug: string): string {
    return `${slug}@restaurant.local`
  }

  private toRestaurantEntity(
    payload: CreateRestaurantInput,
    email: string
  ): Partial<Restaurant> {
    return {
      name: payload.name,
      slug: payload.slug,
      email,
      phone: payload.phone,
      phones: [payload.phone],
      address: payload.address,
      description: payload.description,
      city: 'TBD',
      logo: '',
      preview: '',
      deliveryTime: 0,
      deliveryConditions: '',
      cuisine: [],
      workSchedule: [],
      isActive: true
    }
  }
}
