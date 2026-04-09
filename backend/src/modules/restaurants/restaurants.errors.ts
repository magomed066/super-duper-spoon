export class RestaurantsHttpError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message)
    this.name = 'RestaurantsHttpError'
  }
}
