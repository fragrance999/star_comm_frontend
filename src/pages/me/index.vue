<template>
  <view class="page profile-page">
    <view class="header">
      <text class="eyebrow">MY STAR MAP</text>
      <text class="title">我的档案</text>
      <text class="subtitle">留给星灵认识你的第一道信号</text>
    </view>

    <view v-if="authStore.user" class="profile-card">
      <view class="identity">
        <image class="profile-mark" src="/static/brand/app-icon.png" mode="aspectFill" />
        <view class="identity-copy">
          <text class="nickname">{{ authStore.user.nickname }}</text>
          <view class="identity-status">
            <view class="status-light" />
            <text>星图已连接</text>
          </view>
        </view>
      </view>

      <view class="profile-list">
        <view class="row">
          <text class="key">账号</text>
          <text class="value">{{ authStore.user.account }}</text>
        </view>
        <view class="row">
          <text class="key">出生年份</text>
          <text class="value">{{ authStore.user.birth_year }}</text>
        </view>
        <view class="row">
          <text class="key">当前状态</text>
          <text class="value status-value">{{ authStore.user.status }}</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <button class="secondary-button" @click="refreshUser">同步最新资料</button>
      <button class="danger-button" @click="handleLogout">退出登录</button>
    </view>
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
  margin-bottom: 44rpx;
}

.eyebrow {
  display: block;
  color: #aaa2ec;
  font-size: 19rpx;
  font-weight: 600;
  letter-spacing: 4rpx;
  line-height: 32rpx;
}

.title {
  display: block;
  margin-top: 8rpx;
  color: #f2efe6;
  font-size: 46rpx;
  font-weight: 700;
  line-height: 60rpx;
}

.subtitle {
  display: block;
  margin-top: 8rpx;
  color: #9793a8;
  font-size: 25rpx;
  line-height: 40rpx;
}

.profile-card {
  overflow: hidden;
  margin-bottom: 30rpx;
  border: 2rpx solid rgba(213, 208, 255, 0.2);
  border-radius: 16rpx;
  background: rgba(17, 17, 29, 0.94);
  box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.24);
}

.identity {
  display: flex;
  align-items: center;
  gap: 22rpx;
  padding: 32rpx 30rpx;
  border-bottom: 2rpx solid rgba(213, 208, 255, 0.13);
}

.profile-mark {
  flex: 0 0 auto;
  width: 104rpx;
  height: 104rpx;
  border: 2rpx solid rgba(240, 236, 255, 0.4);
  border-radius: 24rpx;
  box-shadow: 0 0 32rpx rgba(132, 112, 255, 0.25);
}

.identity-copy {
  min-width: 0;
}

.nickname {
  display: block;
  overflow: hidden;
  color: #f2efe6;
  font-size: 36rpx;
  font-weight: 600;
  line-height: 48rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.identity-status {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 8rpx;
  color: #aaa6b9;
  font-size: 22rpx;
  line-height: 32rpx;
}

.status-light {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #98e6cd;
  box-shadow: 0 0 14rpx rgba(152, 230, 205, 0.8);
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  padding: 26rpx 30rpx;
  border-bottom: 2rpx solid rgba(213, 208, 255, 0.1);
}

.row:last-child {
  border-bottom: 0;
}

.key {
  flex: 0 0 auto;
  color: #9691aa;
  font-size: 25rpx;
  line-height: 38rpx;
}

.value {
  flex: 1;
  color: #e8e4ef;
  font-size: 25rpx;
  line-height: 38rpx;
  text-align: right;
  word-break: break-all;
}

.status-value {
  color: #bbb4ff;
}

.actions {
  display: grid;
  gap: 20rpx;
}

.danger-button {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid rgba(255, 155, 168, 0.32);
  border-radius: 16rpx;
  background: rgba(64, 24, 38, 0.52);
  color: #ffb1bc;
  font-size: 30rpx;
  font-weight: 500;
  line-height: 84rpx;
}
</style>
