<template>
  <view class="launch-page">
    <view class="launch-core" aria-hidden="true">
      <view class="signal-ring ring-one" />
      <view class="signal-ring ring-two" />
      <view class="signal-ring ring-three" />
      <image class="launch-mark" src="/static/brand/app-icon.png" mode="aspectFill" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let redirectTimer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  redirectTimer = setTimeout(() => {
    uni.reLaunch({ url: '/pages/login/index' })
  }, 900)
})

onUnmounted(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
  }
})
</script>

<style scoped>
.launch-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  background: #07070e;
}

.launch-core {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 260rpx;
  height: 260rpx;
}

.launch-mark {
  position: relative;
  z-index: 1;
  width: 150rpx;
  height: 150rpx;
  border: 2rpx solid rgba(242, 239, 230, 0.5);
  border-radius: 34rpx;
  box-shadow: 0 0 64rpx rgba(132, 112, 255, 0.42);
  animation: launch-mark 860ms cubic-bezier(0.2, 0.72, 0.25, 1) both;
}

.signal-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150rpx;
  height: 150rpx;
  border: 2rpx solid rgba(177, 168, 255, 0.56);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.2);
  animation: signal-expand 760ms ease-out both;
}

.ring-two {
  border-color: rgba(246, 167, 210, 0.38);
  animation-delay: 100ms;
}

.ring-three {
  border-color: rgba(157, 229, 209, 0.28);
  animation-delay: 200ms;
}

@keyframes launch-mark {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }

  58% {
    opacity: 1;
    transform: scale(1.18);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes signal-expand {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }

  28% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(3.8);
  }
}
</style>
