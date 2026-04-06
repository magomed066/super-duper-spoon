export type CreateApplicationDto = {
  email: string
  name: string
  restaurantName: string
  address: string
  phone: string
}

export type ApplicationDto = {
  id: string
  email: string
  name: string
  restaurantName: string
  address: string
  phone: string
  status: string
  createdAt: Date
}

export type ApprovalResult = {
  application: ApplicationDto
  password: string
}
