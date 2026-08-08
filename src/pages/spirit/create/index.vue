<template>
  <view class="page create-page">
    <view class="header">
      <text class="eyebrow">YOUR STAR SPIRIT</text>
      <text class="title">让星灵诞生</text>
      <text class="subtitle">选一个最像你的陪伴方式，之后也可以调整性格和联系频率。</text>
    </view>

    <view class="section">
      <text class="section-title">想怎么称呼它？</text>
      <input v-model="form.name" class="name-input" maxlength="16" placeholder="星灵" />
    </view>

    <view class="section">
      <text class="section-title">它会以什么样子出现？</text>
      <view class="appearance-grid">
        <button
          v-for="option in appearances"
          :key="option.value"
          class="appearance-option"
          :class="{ selected: form.appearance_type === option.value }"
          @click="form.appearance_type = option.value"
        >
          <SpiritAvatar :appearance="option.value" size="small" />
          <text>{{ option.label }}</text>
        </button>
      </view>
    </view>

    <view class="section">
      <text class="section-title">它更像哪种朋友？</text>
      <view class="choice-list">
        <button
          v-for="option in personas"
          :key="option.value"
          class="choice-option"
          :class="{ selected: form.persona_type === option.value }"
          @click="form.persona_type = option.value"
        >
          <text>{{ option.label }}</text>
          <text class="choice-dot" aria-hidden="true" />
        </button>
      </view>
    </view>

    <view class="section">
      <text class="section-title">希望它多久主动联系？</text>
      <view class="choice-list">
        <button
          v-for="option in initiatives"
          :key="option.value"
          class="choice-option"
          :class="{ selected: form.initiative_level === option.value }"
          @click="form.initiative_level = option.value"
        >
          <text>{{ option.label }}</text>
          <text class="choice-dot" aria-hidden="true" />
        </button>
      </view>
    </view>

    <view class="actions">
      <button class="primary-button" :disabled="submitting" @click="submitForm">{{ submitting ? '正在连接...' : '让它出现' }}</button>
      <button class="text-button" :disabled="submitting" @click="skip">先用默认设置</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import SpiritAvatar from '@/components/SpiritAvatar.vue'
import { useSpiritStore } from '@/stores/spirit'
import type { AppearanceType, InitiativeLevel, PersonaType, SpiritCreateRequest } from '@/types/spirit'

const spiritStore = useSpiritStore()
const submitting = ref(false)
interface SpiritForm {
  name: string
  appearance_type: AppearanceType
  persona_type: PersonaType
  initiative_level: InitiativeLevel
}

const form = reactive<SpiritForm>({
  name: '',
  appearance_type: 'STARLIGHT',
  persona_type: 'WARM_LISTENER',
  initiative_level: 'IMPORTANT_EVENTS',
})

const appearances: Array<{ value: AppearanceType; label: string }> = [
  { value: 'STARLIGHT', label: '星光精灵' },
  { value: 'FOX', label: '小狐狸星灵' },
  { value: 'OTTER', label: '小海獭星灵' },
  { value: 'ROBOT', label: '机械星灵' },
]
const personas: Array<{ value: PersonaType; label: string }> = [
  { value: 'WARM_LISTENER', label: '温暖的倾听者' },
  { value: 'FUN_COMPANION', label: '有趣的聊天搭子' },
  { value: 'SOCIAL_ADVISOR', label: '理性的社交顾问' },
  { value: 'DIRECT_FRIEND', label: '温和但直接的朋友' },
]
const initiatives: Array<{ value: InitiativeLevel; label: string }> = [
  { value: 'PASSIVE', label: '只有我找它时' },
  { value: 'OCCASIONAL', label: '偶尔主动问候' },
  { value: 'IMPORTANT_EVENTS', label: '发现重要事情时提醒' },
]

async function submit(payload: SpiritCreateRequest) {
  submitting.value = true
  try {
    await spiritStore.create(payload)
    uni.redirectTo({ url: '/pages/spirit/onboarding/index' })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '创建失败，请重试', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function skip() {
  submit({})
}

function submitForm() {
  submit({ ...form, name: form.name.trim() || undefined })
}
</script>

<style scoped>
.header { margin-bottom: 46rpx; }
.eyebrow { display: block; color: #9de5d1; font-size: 19rpx; font-weight: 700; letter-spacing: 3rpx; line-height: 32rpx; }
.title { display: block; margin-top: 10rpx; color: #f2efe6; font-size: 52rpx; font-weight: 700; line-height: 68rpx; }
.subtitle { display: block; margin-top: 12rpx; color: #aaa6b9; font-size: 26rpx; line-height: 42rpx; }
.section { margin-bottom: 40rpx; }
.section-title { display: block; margin-bottom: 20rpx; color: #e9e5f3; font-size: 29rpx; font-weight: 600; line-height: 40rpx; }
.name-input { width: 100%; height: 88rpx; box-sizing: border-box; border: 2rpx solid rgba(213, 208, 255, 0.2); border-radius: 10rpx; background: #10101a; color: #f2efe6; font-size: 28rpx; padding: 0 22rpx; }
.appearance-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16rpx; }
.appearance-option, .choice-option { border: 2rpx solid rgba(213, 208, 255, 0.18); border-radius: 12rpx; background: rgba(17, 17, 29, 0.9); color: #dcd8e9; }
.appearance-option { display: flex; align-items: center; gap: 12rpx; min-height: 118rpx; padding: 14rpx; font-size: 24rpx; line-height: 32rpx; text-align: left; }
.appearance-option.selected, .choice-option.selected { border-color: #9de5d1; background: rgba(39, 70, 69, 0.5); color: #f2efe6; }
.choice-list { display: grid; gap: 12rpx; }
.choice-option { display: flex; align-items: center; justify-content: space-between; min-height: 86rpx; padding: 0 24rpx; font-size: 27rpx; text-align: left; }
.choice-dot { width: 18rpx; height: 18rpx; border: 2rpx solid #8b87a4; border-radius: 50%; }
.selected .choice-dot { border-color: #9de5d1; background: #9de5d1; box-shadow: 0 0 16rpx rgba(157, 229, 209, 0.7); }
.actions { display: grid; gap: 18rpx; margin-top: 12rpx; padding-bottom: 30rpx; }
</style>
