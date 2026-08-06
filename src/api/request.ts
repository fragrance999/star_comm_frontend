import { getAccessToken } from '@/utils/storage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly detail?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  data?: unknown
  auth?: boolean
}

export function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (options.auth) {
    const token = getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${path}`,
      method: options.method || 'GET',
      data: options.data,
      header: headers,
      success: (response) => {
        const statusCode = response.statusCode || 0
        if (statusCode >= 200 && statusCode < 300) {
          resolve(response.data as T)
          return
        }

        const detail = response.data
        reject(new ApiError(getErrorMessage(detail), statusCode, detail))
      },
      fail: (error) => {
        reject(new ApiError(error.errMsg || '网络请求失败', 0, error))
      },
    })
  })
}

function getErrorMessage(detail: unknown): string {
  if (typeof detail === 'object' && detail !== null && 'detail' in detail) {
    const value = (detail as { detail?: unknown }).detail
    if (typeof value === 'string') {
      return value
    }
  }
  return '请求失败，请稍后再试'
}
