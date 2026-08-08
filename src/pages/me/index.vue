<template>
  <view class="page profile-page">
    <view class="header">
      <text class="eyebrow">MY STAR MAP</text>
      <text class="title">我的档案</text>
      <text class="subtitle">留给星灵认识你的第一道信号</text>
    </view>

    <view v-if="authStore.user" class="profile-card">
      <view class="identity">
        <SpiritAvatar v-if="spirit" :appearance="spirit.appearance_type" size="small" />
        <image v-else class="profile-mark" src="/static/brand/app-icon.png" mode="aspectFill" />
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

    <view v-if="spirit" class="settings-panel">
      <text class="settings-title">星灵设置</text>
      <view class="setting-row name-setting">
        <view>
          <text class="setting-label">星灵名字</text>
          <text class="setting-value">可随时修改</text>
        </view>
        <input v-model="spiritName" class="name-input" maxlength="16" confirm-type="done" @blur="saveName" @confirm="saveName" />
      </view>
      <picker :range="personaOptions" range-key="label" :value="personaIndex" @change="changePersona">
        <view class="setting-row">
          <view>
            <text class="setting-label">相处方式</text>
            <text class="setting-value">{{ personaOptions[personaIndex].label }}</text>
          </view>
          <text class="setting-arrow">›</text>
        </view>
      </picker>
      <picker :range="initiativeOptions" range-key="label" :value="initiativeIndex" @change="changeInitiative">
        <view class="setting-row">
          <view>
            <text class="setting-label">主动联系</text>
            <text class="setting-value">{{ initiativeOptions[initiativeIndex].label }}</text>
          </view>
          <text class="setting-arrow">›</text>
        </view>
      </picker>
    </view>

    <view class="actions">
      <button class="secondary-button" @click="refreshUser">同步最新资料</button>
      <button class="danger-button" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import SpiritAvatar from '@/components/SpiritAvatar.vue'
import { useAuthStore } from '@/stores/auth'
import { useSpiritStore } from '@/stores/spirit'
import type { InitiativeLevel, PersonaType, SpiritUpdateRequest } from '@/types/spirit'

const authStore = useAuthStore()
const spiritStore = useSpiritStore()
const spirit = computed(() => spiritStore.spirit)
const spiritName = ref('')
const savingName = ref(false)
const personaOptions: Array<{ value: PersonaType; label: string }> = [
  { value: 'WARM_LISTENER', label: '温暖的倾听者' },
  { value: 'FUN_COMPANION', label: '有趣的聊天搭子' },
  { value: 'SOCIAL_ADVISOR', label: '理性的社交顾问' },
  { value: 'DIRECT_FRIEND', label: '温和但直接的朋友' },
]
const initiativeOptions: Array<{ value: InitiativeLevel; label: string }> = [
  { value: 'PASSIVE', label: '只有我找它时' },
  { value: 'OCCASIONAL', label: '偶尔主动问候' },
  { value: 'IMPORTANT_EVENTS', label: '发现重要事情时提醒' },
]
const personaIndex = computed(() => Math.max(0, personaOptions.findIndex((option) => option.value === spirit.value?.persona_type)))
const initiativeIndex = computed(() => Math.max(0, initiativeOptions.findIndex((option) => option.value === spirit.value?.initiative_level)))

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    await authStore.restore()
  }
  if (!authStore.isLoggedIn) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  const state = await spiritStore.load()
  spiritName.value = state.spirit?.name || ''
})

async function refreshUser() {
  await authStore.restore()
  uni.showToast({ title: '已刷新', icon: 'none' })
}

async function handleLogout() {
  await authStore.logout()
}

async function changePersona(event: { detail: { value: string } }) {
  const option = personaOptions[Number(event.detail.value)]
  if (!option || option.value === spirit.value?.persona_type) return
  await updateSettings({ persona_type: option.value })
}

async function changeInitiative(event: { detail: { value: string } }) {
  const option = initiativeOptions[Number(event.detail.value)]
  if (!option || option.value === spirit.value?.initiative_level) return
  await updateSettings({ initiative_level: option.value })
}

async function saveName() {
  const currentName = spirit.value?.name || ''
  const nextName = spiritName.value.trim()
  if (!nextName) {
    spiritName.value = currentName
    uni.showToast({ title: '名字不能为空', icon: 'none' })
    return
  }
  if (nextName === currentName || savingName.value) return

  savingName.value = true
  try {
    await updateSettings({ name: nextName })
    spiritName.value = spirit.value?.name || nextName
  } finally {
    savingName.value = false
  }
}

async function updateSettings(payload: SpiritUpdateRequest) {
  try {
    await spiritStore.updateSettings(payload)
    uni.showToast({ title: '已更新', icon: 'none' })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '更新失败', icon: 'none' })
  }
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

.settings-panel {
  margin-bottom: 30rpx;
  border: 2rpx solid rgba(157, 229, 209, 0.2);
  border-radius: 16rpx;
  background: rgba(17, 17, 29, 0.94);
  overflow: hidden;
}

.settings-title {
  display: block;
  padding: 26rpx 30rpx 14rpx;
  color: #9de5d1;
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  line-height: 32rpx;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 30rpx;
  border-top: 2rpx solid rgba(213, 208, 255, 0.1);
}

.setting-label, .setting-value { display: block; }
.setting-label { color: #9691aa; font-size: 23rpx; line-height: 34rpx; }
.setting-value { margin-top: 4rpx; color: #f2efe6; font-size: 28rpx; line-height: 40rpx; }
.setting-arrow { color: #9de5d1; font-size: 48rpx; line-height: 48rpx; }
.name-setting { gap: 18rpx; }
.name-input { width: 208rpx; height: 66rpx; box-sizing: border-box; border: 2rpx solid rgba(213, 208, 255, 0.24); border-radius: 8rpx; background: #10101a; color: #f2efe6; font-size: 25rpx; padding: 0 16rpx; text-align: right; }

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
