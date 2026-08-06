import { request } from '@/api/request'
import type { LoginRequest, RegisterRequest, TokenPair, User } from '@/types/auth'

export function register(payload: RegisterRequest): Promise<User> {
  return request<User>('/auth/register', {
    method: 'POST',
    data: payload,
  })
}

export function login(payload: LoginRequest): Promise<TokenPair> {
  return request<TokenPair>('/auth/login', {
    method: 'POST',
    data: payload,
  })
}

export function logout(refreshToken: string): Promise<void> {
  return request<void>('/auth/logout', {
    method: 'POST',
    data: { refresh_token: refreshToken },
  })
}

export function getMe(): Promise<User> {
  return request<User>('/users/me', {
    auth: true,
  })
}
