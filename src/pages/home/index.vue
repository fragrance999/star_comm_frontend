<template>
  <view class="page home-page">
    <view class="top">
      <text class="eyebrow">首页</text>
      <text class="title">你好，{{ displayName }}</text>
    </view>

    <view class="spirit-panel">
      <text class="panel-title">星灵正在准备中</text>
      <text class="panel-body">
        当前阶段已完成账号登录基础。下一阶段会在这里接入星灵诞生和首次对话。
      </text>
    </view>

    <view class="actions">
      <button class="secondary-button" @click="refreshUser">刷新登录状态</button>
      <button class="secondary-button" @click="goMe">查看我的</button>
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
  padding-top: 64rpx;
}

.top {
  margin-bottom: 48rpx;
}

.eyebrow {
  display: block;
  color: #2347ff;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 36rpx;
}

.title {
  display: block;
  margin-top: 8rpx;
  color: #1f2933;
  font-size: 46rpx;
  font-weight: 700;
  line-height: 62rpx;
}

.spirit-panel {
  padding: 32rpx;
  border: 2rpx solid #d8dde8;
  border-radius: 8rpx;
  background: #ffffff;
}

.panel-title {
  display: block;
  color: #1f2933;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 48rpx;
}

.panel-body {
  display: block;
  margin-top: 12rpx;
  color: #596579;
  font-size: 28rpx;
  line-height: 44rpx;
}

.actions {
  display: grid;
  gap: 24rpx;
  margin-top: 32rpx;
}
</style>
