<template>
  <view class="page conversation-page">
    <view class="conversation-header">
      <SpiritAvatar v-if="spirit" :appearance="spirit.appearance_type" :emotion="streaming ? 'thinking' : 'default'" size="small" />
      <view>
        <text class="header-title">{{ spirit?.name || '星灵' }}</text>
        <text class="header-status">{{ streaming ? '正在思考' : '刚刚诞生' }}</text>
      </view>
    </view>

    <scroll-view class="message-list" scroll-y :scroll-into-view="scrollTarget">
      <view v-for="message in messages" :id="`message-${message.key}`" :key="message.key" class="message-row" :class="message.role.toLowerCase()">
        <view v-if="message.role === 'ASSISTANT'" class="mini-avatar"><SpiritAvatar v-if="spirit" :appearance="spirit.appearance_type" :emotion="streaming && message.key === activeAssistantKey ? 'thinking' : 'default'" size="small" /></view>
        <text class="bubble">{{ message.content || '...' }}</text>
      </view>
    </scroll-view>

    <view v-if="candidate" class="memory-panel">
      <text class="memory-label">星灵的第一条理解</text>
      <textarea v-if="editing" v-model="memoryDraft" class="memory-input" auto-height maxlength="240" />
      <text v-else class="memory-copy">{{ candidate.content }}</text>
      <view class="memory-actions">
        <button class="secondary-button compact" :disabled="resolving" @click="toggleEdit">{{ editing ? '保存修改' : '修改' }}</button>
        <button class="secondary-button compact" :disabled="resolving" @click="discard">先不记录</button>
        <button class="primary-button compact" :disabled="resolving" @click="confirm">准确</button>
      </view>
    </view>

    <view v-else class="composer">
      <view v-if="quickOptions.length" class="quick-options">
        <button v-for="option in quickOptions" :key="option" class="quick-option" :disabled="streaming" @click="send(option)">{{ option }}</button>
      </view>
      <view class="input-row">
        <input v-model="draft" class="chat-input" maxlength="1000" confirm-type="send" placeholder="说说你的想法" @confirm="sendDraft" />
        <button class="send-button" :disabled="streaming || !draft.trim()" aria-label="发送" @click="sendDraft">↑</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SpiritAvatar from '@/components/SpiritAvatar.vue'
import { useStreamTextRenderer } from '@/composables/useStreamTextRenderer'
import { confirmMemory, discardMemory, getSpiritMessages, streamSpiritMessage, updateMemory } from '@/api/spirit'
import { useAuthStore } from '@/stores/auth'
import { useSpiritStore } from '@/stores/spirit'
import type { SpiritMemory, SpiritMessage } from '@/types/spirit'

interface DisplayMessage extends SpiritMessage { key: string }

const authStore = useAuthStore()
const spiritStore = useSpiritStore()
const messages = ref<DisplayMessage[]>([])
const draft = ref('')
const candidate = ref<SpiritMemory | null>(null)
const memoryDraft = ref('')
const editing = ref(false)
const streaming = ref(false)
const resolving = ref(false)
const activeAssistantKey = ref('')
const scrollTarget = ref('')
const turnCount = ref(0)
const spirit = computed(() => spiritStore.spirit)
const textRenderer = useStreamTextRenderer()
const quickOptions = computed(() => {
  if (turnCount.value === 0) return ['能随时聊几句的人', '有共同爱好的搭子', '同城可以一起活动的人', '目前只想先和星灵聊聊']
  if (turnCount.value === 1) return ['自然随意地聊', '直接一点更舒服', '有趣但不过分热闹']
  if (turnCount.value === 2) return ['散步或运动', '看书听歌', '和熟人安静待着']
  return []
})

onMounted(async () => {
  if (!authStore.isLoggedIn) await authStore.restore()
  if (!authStore.isLoggedIn) return uni.reLaunch({ url: '/pages/login/index' })
  try {
    const state = await spiritStore.load()
    if (!state.spirit) return uni.reLaunch({ url: '/pages/spirit/create/index' })
    if (state.onboarding_completed) return uni.reLaunch({ url: '/pages/home/index' })
    candidate.value = state.pending_memory
    memoryDraft.value = state.pending_memory?.content || ''
    turnCount.value = state.onboarding_session?.user_turn_count || 0
    if (state.onboarding_session) {
      const history = await getSpiritMessages(state.onboarding_session.id)
      messages.value = history.messages.map(toDisplayMessage)
    }
    if (!messages.value.length) {
      push('ASSISTANT', '你好，我是刚刚诞生的星灵。以后我会慢慢了解你，但所有记忆都由你决定是否保留。最近你更希望认识哪种人？')
    }
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '连接失败', icon: 'none' })
  }
})

async function send(content: string) {
  if (!content.trim() || streaming.value || candidate.value) return
  draft.value = ''
  turnCount.value += 1
  push('USER', content)
  streaming.value = true
  let assistantKey = ''
  const pendingCandidate = ref<SpiritMemory | null>(null)
  try {
    await streamSpiritMessage('/spirit/onboarding/messages/stream', content, (event) => {
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
      if (event.event === 'memory.candidate') {
        pendingCandidate.value = event.data as unknown as SpiritMemory
      }
    })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '发送失败', icon: 'none' })
  } finally {
    await textRenderer.waitForIdle()
    if (pendingCandidate.value) {
      candidate.value = pendingCandidate.value
      memoryDraft.value = pendingCandidate.value.content
    }
    streaming.value = false
    activeAssistantKey.value = ''
    scrollToBottom()
  }
}

function sendDraft() { send(draft.value) }

async function toggleEdit() {
  if (!candidate.value) return
  if (!editing.value) {
    editing.value = true
    return
  }
  try {
    candidate.value = await updateMemory(candidate.value.id, memoryDraft.value)
    editing.value = false
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '修改失败', icon: 'none' })
  }
}

async function confirm() {
  if (!candidate.value) return
  resolving.value = true
  try {
    await confirmMemory(candidate.value.id)
    await spiritStore.load()
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '确认失败', icon: 'none' })
  } finally { resolving.value = false }
}

async function discard() {
  if (!candidate.value) return
  resolving.value = true
  try {
    await discardMemory(candidate.value.id)
    await spiritStore.load()
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '操作失败', icon: 'none' })
  } finally { resolving.value = false }
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
.quick-options { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 16rpx; }
.quick-option { border: 2rpx solid rgba(157, 229, 209, 0.32); border-radius: 10rpx; background: rgba(33, 66, 64, 0.44); color: #d5f3ea; font-size: 23rpx; line-height: 34rpx; padding: 14rpx 18rpx; text-align: left; }
.input-row { display: flex; align-items: center; gap: 14rpx; }
.chat-input { flex: 1; height: 80rpx; box-sizing: border-box; border: 2rpx solid rgba(213, 208, 255, 0.2); border-radius: 10rpx; background: #10101a; color: #f2efe6; font-size: 27rpx; padding: 0 20rpx; }
.send-button { width: 80rpx; height: 80rpx; border: 0; border-radius: 10rpx; background: #9de5d1; color: #10211e; font-size: 42rpx; font-weight: 700; line-height: 76rpx; }
.memory-panel { margin-top: 14rpx; padding: 24rpx; border: 2rpx solid rgba(244, 166, 207, 0.42); border-radius: 12rpx; background: rgba(53, 31, 52, 0.82); }
.memory-label { display: block; color: #f4a6cf; font-size: 22rpx; font-weight: 700; line-height: 32rpx; }
.memory-copy { display: block; margin-top: 12rpx; color: #f2eaf1; font-size: 29rpx; line-height: 44rpx; }
.memory-input { width: 100%; min-height: 88rpx; box-sizing: border-box; margin-top: 12rpx; border: 2rpx solid rgba(244, 166, 207, 0.5); border-radius: 8rpx; background: #201720; color: #f2eaf1; font-size: 27rpx; line-height: 40rpx; padding: 14rpx; }
.memory-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12rpx; margin-top: 20rpx; }
.compact { height: 72rpx; font-size: 23rpx; line-height: 68rpx; letter-spacing: 0; }
</style>
