export const categoriesQueryKeys = {
  all: (restaurantId?: string) =>
    restaurantId ? ['restaurants', restaurantId, 'categories'] : ['categories'],
  detail: (restaurantId: string, categoryId: string) => [
    'restaurants',
    restaurantId,
    'categories',
    categoryId
  ]
} as const
