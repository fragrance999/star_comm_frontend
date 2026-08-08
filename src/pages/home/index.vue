<template>
  <view class="page home-page">
    <view class="top-bar">
      <text class="title">你好，{{ displayName }}</text>
    </view>

    <view class="signal-stage">
      <view class="signal-status">
        <view class="status-light" />
        <text>星灵在线</text>
      </view>
      <view class="signal-visual">
        <view class="orbit orbit-one" />
        <view class="orbit orbit-two" />
        <view class="signal-beam" />
        <view class="signal-node node-one" />
        <view class="signal-node node-two" />
        <image class="spirit-mark" src="/static/brand/app-icon.png" mode="aspectFill" />
      </view>
      <text class="panel-title">星灵正在回应</text>
    </view>

    <view class="actions">
      <button class="secondary-button" @click="refreshUser">刷新</button>
      <button class="primary-button" @click="goMe">我的星图</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const displayName = computed(() => authStore.user?.nickname || '新朋友')

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    await authStore.restore()
  }
  if (!authStore.isLoggedIn) {
    uni.reLaunch({ url: '/pages/login/index' })
  }
})

async function refreshUser() {
  await authStore.restore()
  uni.showToast({ title: '已刷新', icon: 'none' })
}

function goMe() {
  uni.navigateTo({ url: '/pages/me/index' })
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  padding-top: 76rpx;
  padding-bottom: 60rpx;
}

.top-bar {
  margin-bottom: 16rpx;
}

.title {
  display: block;
  color: #f2efe6;
  font-size: 52rpx;
  font-weight: 700;
  line-height: 68rpx;
}

.signal-stage {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 620rpx;
  padding: 10rpx 0 26rpx;
}

.signal-visual {
  position: relative;
  height: 500rpx;
  overflow: hidden;
  background:
    linear-gradient(90deg, transparent 49.8%, rgba(184, 175, 255, 0.14) 50%, transparent 50.2%),
    linear-gradient(transparent 49.8%, rgba(184, 175, 255, 0.1) 50%, transparent 50.2%);
  background-size: 100% 100%;
}

.signal-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  color: #aaa6c3;
  font-size: 21rpx;
  letter-spacing: 2rpx;
  line-height: 32rpx;
}

.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2rpx solid rgba(160, 150, 255, 0.24);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-one {
  width: 540rpx;
  height: 220rpx;
  animation: orbit-breathe 5s ease-in-out infinite;
}

.orbit-two {
  width: 350rpx;
  height: 350rpx;
  border-color: rgba(255, 163, 210, 0.16);
  animation: orbit-turn 16s linear infinite;
}

.signal-beam {
  position: absolute;
  top: 72rpx;
  bottom: 72rpx;
  left: 50%;
  width: 2rpx;
  background: rgba(192, 184, 255, 0.32);
  box-shadow: 0 0 20rpx rgba(164, 147, 255, 0.4);
  animation: beam-pulse 2.8s ease-in-out infinite;
}

.signal-node {
  position: absolute;
  left: 50%;
  width: 12rpx;
  height: 12rpx;
  margin-left: -6rpx;
  border-radius: 50%;
  background: #f4a6cf;
  box-shadow: 0 0 18rpx rgba(244, 166, 207, 0.9);
}

.node-one {
  top: 80rpx;
  animation: signal-travel 3.6s ease-in-out infinite;
}

.node-two {
  bottom: 80rpx;
  background: #9de5d1;
  box-shadow: 0 0 18rpx rgba(157, 229, 209, 0.8);
  animation: signal-travel 3.6s ease-in-out 1.8s infinite reverse;
}

.spirit-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 162rpx;
  height: 162rpx;
  border: 2rpx solid rgba(240, 236, 255, 0.5);
  border-radius: 36rpx;
  box-shadow: 0 0 70rpx rgba(132, 112, 255, 0.42);
  transform: translate(-50%, -50%);
  animation: core-float 4.2s ease-in-out infinite;
}

.status-light {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #98e6cd;
  box-shadow: 0 0 14rpx rgba(152, 230, 205, 0.8);
  animation: status-pulse 2s ease-in-out infinite;
}

.panel-title {
  display: block;
  margin-top: 12rpx;
  color: #f2efe6;
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  line-height: 56rpx;
  text-align: center;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 20rpx;
  margin-top: 12rpx;
}

@keyframes orbit-breathe {
  0%,
  100% {
    opacity: 0.38;
    transform: translate(-50%, -50%) scale(0.94);
  }

  50% {
    opacity: 0.88;
    transform: translate(-50%, -50%) scale(1.04);
  }
}

@keyframes orbit-turn {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes beam-pulse {
  0%,
  100% {
    opacity: 0.18;
  }

  50% {
    opacity: 0.9;
  }
}

@keyframes signal-travel {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(320rpx);
  }
}

@keyframes core-float {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(0.96);
  }

  50% {
    transform: translate(-50%, -54%) scale(1.03);
  }
}

@keyframes status-pulse {
  0%,
  100% {
    opacity: 0.48;
  }

  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit,
  .signal-beam,
  .signal-node,
  .spirit-mark,
  .status-light {
    animation: none;
  }
}
</style>
