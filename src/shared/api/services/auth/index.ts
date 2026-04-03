import { apiService } from '@/shared/api/base'
import type {
  AuthRegisterResponse,
  UserLogin,
  UserLoginResponse,
  UserRegister
} from './types'

export class AuthService {
  static login(data: UserLogin): Promise<UserLoginResponse> {
    return apiService.post<UserLoginResponse>('/auth/login', data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  static register(data: UserRegister): Promise<AuthRegisterResponse> {
    return apiService.post<AuthRegisterResponse>('/auth/register', data)
  }
}
