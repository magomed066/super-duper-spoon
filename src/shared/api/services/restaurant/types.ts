export type Restaurant = {
  id: string
  name: string
  slug: string
  cuisine: string[]
  email: string
  phones: string[]
  city: string
  logo: string
  preview: string
  workSchedule: Array<{
    day: string
    open: string
    close: string
  }>
  deliveryTime: number
  deliveryConditions: string
  description: string | null
  phone: string | null
  address: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
