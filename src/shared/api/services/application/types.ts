export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type RequestClient = {
  id: string
  email: string
  name: string
  restaurantName: string
  address: string
  phone: string
  status: ApplicationStatus
  createdAt?: string
}

export type RequestClientCreate = Omit<
  RequestClient,
  'id' | 'createdAt' | 'status'
>

export type ApproveApplicationResult = {
  application: RequestClient
  password: string
}
