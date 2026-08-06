<template>
  <view class="page">
    <view class="header">
      <text class="title">我的</text>
      <text class="subtitle">账号状态</text>
    </view>

    <view v-if="authStore.user" class="profile">
      <view class="row">
        <text class="key">昵称</text>
        <text class="value">{{ authStore.user.nickname }}</text>
      </view>
      <view class="row">
        <text class="key">账号</text>
        <text class="value">{{ authStore.user.account }}</text>
      </view>
      <view class="row">
        <text class="key">出生年份</text>
        <text class="value">{{ authStore.user.birth_year }}</text>
      </view>
      <view class="row">
        <text class="key">状态</text>
        <text class="value">{{ authStore.user.status }}</text>
      </view>
    </view>

    <button class="secondary-button" @click="refreshUser">刷新资料</button>
    <button class="primary-button logout" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

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

async function handleLogout() {
  await authStore.logout()
}
</script>

<style scoped>
.header {
  margin-bottom: 40rpx;
}

.title {
  display: block;
  color: #1f2933;
  font-size: 44rpx;
  font-weight: 700;
  line-height: 60rpx;
}

.subtitle {
  display: block;
  margin-top: 8rpx;
  color: #596579;
  font-size: 26rpx;
  line-height: 40rpx;
}

.profile {
  margin-bottom: 32rpx;
  border: 2rpx solid #d8dde8;
  border-radius: 8rpx;
  background: #fff;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  padding: 28rpx;
  border-bottom: 2rpx solid #eef1f5;
}

.row:last-child {
  border-bottom: 0;
}

.key {
  color: #596579;
  font-size: 26rpx;
}

.value {
  flex: 1;
  color: #1f2933;
  font-size: 26rpx;
  text-align: right;
  word-break: break-all;
}

.logout {
  margin-top: 24rpx;
  background: #b42318;
}
</style>
