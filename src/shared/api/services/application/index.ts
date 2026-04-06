import { apiService } from '../../base'
import type {
  ApproveApplicationResult,
  RequestClient,
  RequestClientCreate
} from './types'

export class ApplocationService {
  static register(data: RequestClientCreate): Promise<RequestClient> {
    return apiService.post('/applications', data)
  }

  static list(): Promise<RequestClient[]> {
    return apiService.get('/applications')
  }

  static approve(id: string): Promise<ApproveApplicationResult> {
    return apiService.post(`/applications/${id}/approve`)
  }

  static reject(id: string): Promise<RequestClient> {
    return apiService.post(`/applications/${id}/reject`)
  }
}
