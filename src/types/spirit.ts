export type AppearanceType = 'STARLIGHT' | 'FOX' | 'OTTER' | 'ROBOT'
export type PersonaType = 'WARM_LISTENER' | 'FUN_COMPANION' | 'SOCIAL_ADVISOR' | 'DIRECT_FRIEND'
export type InitiativeLevel = 'PASSIVE' | 'OCCASIONAL' | 'IMPORTANT_EVENTS'
export type SpiritEmotion = 'default' | 'joy' | 'thinking' | 'comfort'

export interface Spirit {
  id: number
  name: string
  appearance_type: AppearanceType
  persona_type: PersonaType
  initiative_level: InitiativeLevel
  status: string
  created_at: string
}

export interface SpiritSession {
  id: number
  session_type: string
  status: string
  user_turn_count: number
  created_at: string
}

export interface SpiritMemory {
  id: number
  category: string
  content: string
  confidence: number
  confirmation_status: string
  created_at: string
}

export interface SpiritState {
  spirit: Spirit | null
  onboarding_session: SpiritSession | null
  chat_session: SpiritSession | null
  onboarding_completed: boolean
  pending_memory: SpiritMemory | null
}

export interface SpiritMessage {
  id?: number
  role: 'USER' | 'ASSISTANT'
  content: string
  created_at?: string
}

export interface SpiritMessageList {
  session: SpiritSession
  messages: SpiritMessage[]
}

export interface SpiritCreateRequest {
  name?: string
  appearance_type?: AppearanceType
  persona_type?: PersonaType
  initiative_level?: InitiativeLevel
}

export interface SpiritUpdateRequest {
  name?: string
  persona_type?: PersonaType
  initiative_level?: InitiativeLevel
}

export interface SpiritStreamEvent {
  event: 'message.start' | 'message.delta' | 'message.complete' | 'memory.candidate' | 'error'
  data: Record<string, unknown>
}
