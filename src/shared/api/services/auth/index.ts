import type { AxiosResponse } from 'axios'
import { apiService } from '@/shared/api/base'
import type { UserLogin, UserLoginResponse, UserRegister } from './types'

export class AuthService {
  static login(data: UserLogin): Promise<AxiosResponse<UserLoginResponse>> {
    return apiService.post<AxiosResponse<UserLoginResponse>>(
      '/auth/login',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  static register(data: UserRegister): Promise<AxiosResponse> {
    return apiService.post<AxiosResponse>('/auth/register', data)
  }
}
