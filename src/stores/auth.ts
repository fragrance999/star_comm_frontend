import { defineStore } from 'pinia'

import { getMe, login, logout, register } from '@/api/auth'
import type { LoginRequest, RegisterRequest, User } from '@/types/auth'
import { clearTokens, getRefreshToken, setTokens } from '@/utils/storage'

interface AuthState {
  user: User | null
  isLoggedIn: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    async restore(): Promise<void> {
      try {
        this.user = await getMe()
        this.isLoggedIn = true
      } catch {
        this.clear()
      }
    },
    async registerAndLogin(payload: RegisterRequest): Promise<void> {
      await register(payload)
      await this.login(payload)
    },
    async login(payload: LoginRequest): Promise<void> {
      const tokenPair = await login(payload)
      setTokens(tokenPair.access_token, tokenPair.refresh_token)
      this.user = await getMe()
      this.isLoggedIn = true
    },
    async logout(): Promise<void> {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          await logout(refreshToken)
        } catch {
          // Local logout must still succeed if the server token is already invalid.
        }
      }
      this.clear()
      uni.reLaunch({ url: '/pages/login/index' })
    },
    clear(): void {
      clearTokens()
      this.user = null
      this.isLoggedIn = false
    },
  },
})
