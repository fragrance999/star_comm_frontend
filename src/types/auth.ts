export interface RegisterRequest {
  account: string
  password: string
  nickname: string
  birth_year: number
  avatar_url?: string | null
  invite_code?: string | null
  accepted_terms: boolean
}

export interface LoginRequest {
  account: string
  password: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface User {
  id: number
  account: string
  nickname: string
  birth_year: number
  avatar_url: string | null
  invite_code: string | null
  status: string
  created_at: string
}
