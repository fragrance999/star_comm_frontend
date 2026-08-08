<template>
  <view class="page conversation-page">
    <view class="conversation-header">
      <SpiritAvatar v-if="spirit" :appearance="spirit.appearance_type" :emotion="streaming ? 'thinking' : 'default'" size="small" />
      <view>
        <text class="header-title">{{ spirit?.name || '星灵' }}</text>
        <text class="header-status">{{ streaming ? '正在思考' : '在线陪伴' }}</text>
      </view>
    </view>

    <scroll-view class="message-list" scroll-y :scroll-into-view="scrollTarget">
      <view v-for="message in messages" :id="`message-${message.key}`" :key="message.key" class="message-row" :class="message.role.toLowerCase()">
        <view v-if="message.role === 'ASSISTANT'" class="mini-avatar"><SpiritAvatar v-if="spirit" :appearance="spirit.appearance_type" :emotion="streaming && message.key === activeAssistantKey ? 'thinking' : 'default'" size="small" /></view>
        <text class="bubble">{{ message.content || '...' }}</text>
      </view>
    </scroll-view>

    <view class="composer">
      <view class="input-row">
        <input v-model="draft" class="chat-input" maxlength="1000" confirm-type="send" :placeholder="`和${spirit?.name || '星灵'}聊聊`" @confirm="sendDraft" />
        <button class="send-button" :disabled="streaming || !draft.trim()" aria-label="发送" @click="sendDraft">↑</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SpiritAvatar from '@/components/SpiritAvatar.vue'
import { useStreamTextRenderer } from '@/composables/useStreamTextRenderer'
import { getSpiritMessages, streamSpiritMessage } from '@/api/spirit'
import { useAuthStore } from '@/stores/auth'
import { useSpiritStore } from '@/stores/spirit'
import type { SpiritMessage } from '@/types/spirit'

interface DisplayMessage extends SpiritMessage { key: string }

const authStore = useAuthStore()
const spiritStore = useSpiritStore()
const messages = ref<DisplayMessage[]>([])
const draft = ref('')
const streaming = ref(false)
const activeAssistantKey = ref('')
const scrollTarget = ref('')
const spirit = computed(() => spiritStore.spirit)
const textRenderer = useStreamTextRenderer()

onMounted(async () => {
  if (!authStore.isLoggedIn) await authStore.restore()
  if (!authStore.isLoggedIn) return uni.reLaunch({ url: '/pages/login/index' })
  const state = await spiritStore.load()
  if (!state.spirit) return uni.reLaunch({ url: '/pages/spirit/create/index' })
  if (!state.onboarding_completed) return uni.reLaunch({ url: '/pages/spirit/onboarding/index' })
  if (state.chat_session) {
    const history = await getSpiritMessages(state.chat_session.id)
    messages.value = history.messages.map(toDisplayMessage)
  }
  if (!messages.value.length) push('ASSISTANT', '我在。今天想从哪件小事开始聊？')
})

async function sendDraft() {
  const content = draft.value.trim()
  if (!content || streaming.value) return
  draft.value = ''
  push('USER', content)
  streaming.value = true
  let assistantKey = ''
  try {
    await streamSpiritMessage('/spirit/chat/stream', content, (event) => {
      if (event.event === 'message.start') {
        assistantKey = push('ASSISTANT', '')
        activeAssistantKey.value = assistantKey
      }
      if (event.event === 'message.delta' && assistantKey) {
        const target = messages.value.find((message) => message.key === assistantKey)
        if (target) {
          textRenderer.enqueue(String(event.data.content || ''), (fragment) => {
            target.content += fragment
            scrollToBottom()
          })
        }
      }
    })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '发送失败', icon: 'none' })
  } finally {
    await textRenderer.waitForIdle()
    streaming.value = false
    activeAssistantKey.value = ''
    scrollToBottom()
  }
}

function push(role: SpiritMessage['role'], content: string): string {
  const key = `${Date.now()}-${messages.value.length}`
  messages.value.push({ key, role, content })
  scrollToBottom()
  return key
}

function toDisplayMessage(message: SpiritMessage): DisplayMessage { return { ...message, key: String(message.id || `${message.created_at}-${message.role}`) } }
function scrollToBottom() { scrollTarget.value = `message-${messages.value[messages.value.length - 1]?.key || ''}` }
</script>

<style scoped>
.conversation-page { display: flex; flex-direction: column; height: 100vh; padding-bottom: 24rpx; }
.conversation-header { display: flex; align-items: center; gap: 16rpx; padding-bottom: 22rpx; border-bottom: 2rpx solid rgba(213, 208, 255, 0.12); }
.header-title { display: block; color: #f2efe6; font-size: 34rpx; font-weight: 700; line-height: 42rpx; }
.header-status { display: block; margin-top: 4rpx; color: #9de5d1; font-size: 21rpx; line-height: 30rpx; }
.message-list { flex: 1; min-height: 0; padding: 28rpx 0 12rpx; }
.message-row { display: flex; align-items: flex-end; gap: 12rpx; margin-bottom: 22rpx; }
.message-row.user { justify-content: flex-end; }
.mini-avatar { width: 60rpx; height: 60rpx; overflow: hidden; border-radius: 50%; background: #11111d; }
.mini-avatar :deep(.spirit-avatar) { margin: -12rpx; }
.bubble { max-width: 78%; padding: 20rpx 22rpx; border-radius: 12rpx; background: #151522; color: #eae6f3; font-size: 27rpx; line-height: 42rpx; white-space: pre-wrap; }
.user .bubble { background: #dff7ef; color: #11201e; }
.composer { border-top: 2rpx solid rgba(213, 208, 255, 0.12); padding-top: 18rpx; }
.input-row { display: flex; align-items: center; gap: 14rpx; }
.chat-input { flex: 1; height: 80rpx; box-sizing: border-box; border: 2rpx solid rgba(213, 208, 255, 0.2); border-radius: 10rpx; background: #10101a; color: #f2efe6; font-size: 27rpx; padding: 0 20rpx; }
.send-button { width: 80rpx; height: 80rpx; border: 0; border-radius: 10rpx; background: #9de5d1; color: #10211e; font-size: 42rpx; font-weight: 700; line-height: 76rpx; }
</style>
