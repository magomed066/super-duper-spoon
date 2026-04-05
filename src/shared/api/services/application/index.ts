import { apiService } from '../../base'
import type { RequestClient, RequestClientCreate } from './types'

export class ApplocationService {
  static register(data: RequestClientCreate): Promise<RequestClient> {
    return apiService.post('/applications', data)
  }

  static list(): Promise<RequestClient[]> {
    return apiService.get('/applications')
  }
}
