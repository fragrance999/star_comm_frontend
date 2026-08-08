<template>
  <view class="page register-page">
    <view class="register-header">
      <image class="brand-mark" src="/static/brand/app-icon.png" mode="aspectFill" />
      <view class="header-copy">
        <text class="eyebrow">A NEW SIGNAL</text>
        <text class="title">建立你的星图</text>
        <text class="subtitle">只留下必要的信息，星灵会在相处中慢慢了解你。</text>
      </view>
    </view>

    <view class="form-card">
      <view class="field">
        <text class="label">账号或邮箱</text>
        <input
          v-model.trim="form.account"
          class="input"
          placeholder="请输入账号或邮箱"
          placeholder-style="color: #706f83;"
        />
      </view>

      <view class="field">
        <text class="label">密码</text>
        <input
          v-model="form.password"
          class="input"
          password
          placeholder="至少 8 位密码"
          placeholder-style="color: #706f83;"
        />
      </view>

      <view class="field">
        <text class="label">昵称</text>
        <input
          v-model.trim="form.nickname"
          class="input"
          placeholder="2 到 20 个字符"
          placeholder-style="color: #706f83;"
        />
      </view>

      <view class="field">
        <text class="label">出生年份</text>
        <input
          v-model="birthYearText"
          class="input"
          type="number"
          placeholder="例如 1998"
          placeholder-style="color: #706f83;"
        />
      </view>

      <view class="field">
        <text class="label">邀请码</text>
        <input
          v-model.trim="form.invite_code"
          class="input"
          placeholder="选填"
          placeholder-style="color: #706f83;"
        />
      </view>

      <label class="agreement">
        <checkbox
          :checked="form.accepted_terms"
          color="#aaa2ff"
          @click="form.accepted_terms = !form.accepted_terms"
        />
        <text>我已阅读并同意用户协议和隐私政策</text>
      </label>

      <text v-if="errorMessage" class="error">{{ errorMessage }}</text>

      <button class="primary-button" :disabled="submitting" @click="handleRegister">
        {{ submitting ? '创建中' : '点亮我的星图' }}
      </button>

      <view class="login-entry">
        <text class="login-hint">已经拥有星图？</text>
        <button
          class="text-button login-link"
          hover-class="login-link--pressed"
          :hover-stay-time="80"
          @click="goLogin"
        >
          去登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const submitting = ref(false)
const errorMessage = ref('')
const form = reactive({
  account: '',
  password: '',
  nickname: '',
  birth_year: new Date().getFullYear() - 25,
  invite_code: '',
  accepted_terms: false,
})

const birthYearText = computed({
  get: () => String(form.birth_year),
  set: (value: string) => {
    form.birth_year = Number(value)
  },
})

async function handleRegister() {
  errorMessage.value = ''
  if (!form.account || form.password.length < 8 || form.nickname.length < 2) {
    errorMessage.value = '请填写账号、至少 8 位密码和 2 个字符以上昵称'
    return
  }
  if (!form.birth_year || form.birth_year < 1900) {
    errorMessage.value = '请输入有效出生年份'
    return
  }
  if (!form.accepted_terms) {
    errorMessage.value = '请先同意用户协议和隐私政策'
    return
  }

  submitting.value = true
  try {
    await authStore.registerAndLogin({
      ...form,
      invite_code: form.invite_code || null,
      accepted_terms: form.accepted_terms,
    })
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '注册失败'
  } finally {
    submitting.value = false
  }
}

function goLogin() {
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style scoped>
.register-page {
  padding-bottom: 60rpx;
}

.register-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 42rpx;
}

.brand-mark {
  flex: 0 0 auto;
  width: 104rpx;
  height: 104rpx;
  border: 2rpx solid rgba(240, 236, 255, 0.36);
  border-radius: 24rpx;
  box-shadow: 0 0 36rpx rgba(132, 112, 255, 0.28);
}

.header-copy {
  flex: 1;
  min-width: 0;
}

.eyebrow {
  display: block;
  color: #aaa2ec;
  font-size: 19rpx;
  font-weight: 600;
  letter-spacing: 4rpx;
  line-height: 30rpx;
}

.title {
  display: block;
  margin-top: 4rpx;
  color: #f2efe6;
  font-size: 42rpx;
  font-weight: 700;
  line-height: 60rpx;
}

.subtitle {
  display: block;
  margin-top: 6rpx;
  color: #9793a8;
  font-size: 23rpx;
  line-height: 34rpx;
}

.form-card {
  padding: 34rpx 30rpx 30rpx;
  border: 2rpx solid rgba(213, 208, 255, 0.2);
  border-radius: 16rpx;
  background: rgba(17, 17, 29, 0.92);
  box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.24);
}

.agreement {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin: 8rpx 0 28rpx;
  color: #aaa6b9;
  font-size: 24rpx;
  line-height: 38rpx;
}

.login-link {
  width: 100%;
  height: 80rpx;
  border: 2rpx solid rgba(189, 181, 255, 0.42);
  border-radius: 16rpx;
  background: rgba(128, 116, 235, 0.08);
  color: #d4ceff;
  font-size: 27rpx;
  font-weight: 600;
  line-height: 76rpx;
  letter-spacing: 1rpx;
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.login-entry {
  margin-top: 30rpx;
  padding-top: 26rpx;
  border-top: 2rpx solid rgba(213, 208, 255, 0.12);
  text-align: center;
}

.login-hint {
  display: block;
  margin-bottom: 16rpx;
  color: #858197;
  font-size: 22rpx;
  line-height: 32rpx;
}

.login-link--pressed,
.login-link:active {
  border-color: rgba(220, 214, 255, 0.78);
  background: rgba(150, 136, 255, 0.2);
  color: #f2efe6;
  transform: scale(0.985);
}
</style>
