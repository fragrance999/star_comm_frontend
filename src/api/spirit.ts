import { ApiError, request } from '@/api/request'
import type {
  Spirit,
  SpiritCreateRequest,
  SpiritMemory,
  SpiritMessageList,
  SpiritState,
  SpiritStreamEvent,
  SpiritUpdateRequest,
} from '@/types/spirit'
import { getAccessToken } from '@/utils/storage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

export function getSpirit(): Promise<SpiritState> {
  return request<SpiritState>('/spirit', { auth: true })
}

export function createSpirit(payload: SpiritCreateRequest): Promise<SpiritState> {
  return request<SpiritState>('/spirit', { method: 'POST', data: payload, auth: true })
}

export function updateSpirit(payload: SpiritUpdateRequest): Promise<Spirit> {
  return request<Spirit>('/spirit', { method: 'PATCH', data: payload, auth: true })
}

export function getSpiritMessages(sessionId: number): Promise<SpiritMessageList> {
  return request<SpiritMessageList>(`/spirit/sessions/${sessionId}/messages`, { auth: true })
}

export function updateMemory(memoryId: number, content: string): Promise<SpiritMemory> {
  return request<SpiritMemory>(`/memories/${memoryId}`, { method: 'PATCH', data: { content }, auth: true })
}

export function confirmMemory(memoryId: number): Promise<SpiritMemory> {
  return request<SpiritMemory>(`/memories/${memoryId}/confirm`, { method: 'POST', auth: true })
}

export function discardMemory(memoryId: number): Promise<SpiritMemory> {
  return request<SpiritMemory>(`/memories/${memoryId}/discard`, { method: 'POST', auth: true })
}

export async function streamSpiritMessage(
  path: '/spirit/onboarding/messages/stream' | '/spirit/chat/stream',
  content: string,
  onEvent: (event: SpiritStreamEvent) => void,
): Promise<void> {
  const token = getAccessToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
  })
  if (!response.ok) {
    let detail: unknown
    try {
      detail = await response.json()
    } catch {
      detail = undefined
    }
    throw new ApiError(getStreamErrorMessage(detail), response.status, detail)
  }
  if (!response.body) {
    throw new ApiError('浏览器不支持流式响应', 0)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done })
    const records = buffer.split('\n\n')
    buffer = records.pop() || ''
    for (const record of records) {
      const parsed = parseSseRecord(record)
      if (parsed) onEvent(parsed)
    }
    if (done) break
  }
}

function parseSseRecord(record: string): SpiritStreamEvent | null {
  const eventLine = record.split('\n').find((line) => line.startsWith('event:'))
  const dataLine = record.split('\n').find((line) => line.startsWith('data:'))
  if (!eventLine || !dataLine) return null
  try {
    return {
      event: eventLine.slice(6).trim() as SpiritStreamEvent['event'],
      data: JSON.parse(dataLine.slice(5).trim()) as Record<string, unknown>,
    }
  } catch {
    return null
  }
}

function getStreamErrorMessage(detail: unknown): string {
  if (typeof detail === 'object' && detail !== null && 'detail' in detail) {
    const message = (detail as { detail?: unknown }).detail
    if (typeof message === 'string') return message
  }
  return '星灵暂时无法回应，请稍后再试'
}
