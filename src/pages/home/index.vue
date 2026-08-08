<template>
  <view class="page home-page">
    <view class="top-bar">
      <text class="eyebrow">YOUR STAR SPIRIT</text>
      <text class="title">晚上好，{{ displayName }}</text>
    </view>

    <view v-if="spirit" class="spirit-stage">
      <view class="halo halo-one" />
      <view class="halo halo-two" />
      <SpiritAvatar :appearance="spirit.appearance_type" emotion="joy" size="large" />
      <text class="greeting">我在，想陪你从今天的一件小事开始。</text>
      <text class="supporting">现在没有新的推荐也没关系，我们可以慢慢聊。</text>
    </view>

    <view class="actions">
      <button class="primary-button" @click="goChat">和{{ spirit?.name || '星灵' }}聊聊</button>
      <button class="secondary-button" @click="goMe">我的星图</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import SpiritAvatar from '@/components/SpiritAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { useSpiritStore } from '@/stores/spirit'

const authStore = useAuthStore()
const spiritStore = useSpiritStore()
const displayName = computed(() => authStore.user?.nickname || '新朋友')
const spirit = computed(() => spiritStore.spirit)

onMounted(async () => {
  if (!authStore.isLoggedIn) await authStore.restore()
  if (!authStore.isLoggedIn) return uni.reLaunch({ url: '/pages/login/index' })
  try {
    const state = await spiritStore.load()
    if (!state.spirit) return uni.reLaunch({ url: '/pages/spirit/create/index' })
    if (!state.onboarding_completed) return uni.reLaunch({ url: '/pages/spirit/onboarding/index' })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '连接失败', icon: 'none' })
  }
})

function goChat() { uni.navigateTo({ url: '/pages/spirit/chat/index' }) }
function goMe() { uni.navigateTo({ url: '/pages/me/index' }) }
</script>

<style scoped>
.home-page { display: flex; flex-direction: column; min-height: 100vh; padding-top: 76rpx; padding-bottom: 60rpx; }
.eyebrow { display: block; color: #9de5d1; font-size: 19rpx; font-weight: 700; letter-spacing: 3rpx; line-height: 32rpx; }
.title { display: block; margin-top: 8rpx; color: #f2efe6; font-size: 48rpx; font-weight: 700; line-height: 66rpx; }
.spirit-stage { position: relative; display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; min-height: 690rpx; overflow: hidden; }
.spirit-stage :deep(.spirit-avatar) { position: relative; z-index: 2; filter: drop-shadow(0 0 32rpx rgba(157, 229, 209, 0.28)); }
.halo { position: absolute; border: 2rpx solid rgba(157, 229, 209, 0.16); border-radius: 50%; }
.halo-one { width: 510rpx; height: 270rpx; transform: rotate(-18deg); }
.halo-two { width: 390rpx; height: 390rpx; border-color: rgba(244, 166, 207, 0.15); }
.greeting { position: relative; z-index: 2; display: block; margin-top: 12rpx; color: #f2efe6; font-size: 34rpx; font-weight: 600; line-height: 50rpx; text-align: center; }
.supporting { position: relative; z-index: 2; display: block; max-width: 530rpx; margin-top: 12rpx; color: #aaa6b9; font-size: 25rpx; line-height: 40rpx; text-align: center; }
.actions { display: grid; grid-template-columns: 1.35fr 1fr; gap: 18rpx; }
</style>
