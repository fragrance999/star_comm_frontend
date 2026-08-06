const ACCESS_TOKEN_KEY = 'starcomm_access_token'
const REFRESH_TOKEN_KEY = 'starcomm_refresh_token'

export function getAccessToken(): string {
  return uni.getStorageSync(ACCESS_TOKEN_KEY) || ''
}

export function getRefreshToken(): string {
  return uni.getStorageSync(REFRESH_TOKEN_KEY) || ''
}

export function setTokens(accessToken: string, refreshToken: string): void {
  uni.setStorageSync(ACCESS_TOKEN_KEY, accessToken)
  uni.setStorageSync(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens(): void {
  uni.removeStorageSync(ACCESS_TOKEN_KEY)
  uni.removeStorageSync(REFRESH_TOKEN_KEY)
}
