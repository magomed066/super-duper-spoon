import { Application } from '../entities/application.entity.js'

export type CreateApplicationDto = {
  email: string
  name: string
  restaurantName: string
  address: string
  phone: string
}

export type ApprovalResult = {
  application: Application
  password: string
}
