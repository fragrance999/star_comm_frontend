import { defineStore } from 'pinia'

import { createSpirit, getSpirit, updateSpirit } from '@/api/spirit'
import type { SpiritCreateRequest, SpiritState, SpiritUpdateRequest } from '@/types/spirit'

interface SpiritStoreState {
  state: SpiritState | null
  loading: boolean
}

export const useSpiritStore = defineStore('spirit', {
  state: (): SpiritStoreState => ({
    state: null,
    loading: false,
  }),
  getters: {
    spirit: (state) => state.state?.spirit || null,
    needsOnboarding: (state) => Boolean(state.state?.spirit && !state.state.onboarding_completed),
  },
  actions: {
    async load(): Promise<SpiritState> {
      this.loading = true
      try {
        this.state = await getSpirit()
        return this.state
      } finally {
        this.loading = false
      }
    },
    async create(payload: SpiritCreateRequest): Promise<void> {
      this.state = await createSpirit(payload)
    },
    async updateSettings(payload: SpiritUpdateRequest): Promise<void> {
      const spirit = await updateSpirit(payload)
      if (this.state) this.state.spirit = spirit
    },
  },
})
