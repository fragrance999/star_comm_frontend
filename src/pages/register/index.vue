<template>
  <view class="page">
    <view class="header">
      <text class="title">创建账号</text>
      <text class="subtitle">先完成最小资料，之后再创建你的星灵</text>
    </view>

    <view class="field">
      <text class="label">账号或邮箱</text>
      <input v-model.trim="form.account" class="input" placeholder="请输入账号或邮箱" />
    </view>

    <view class="field">
      <text class="label">密码</text>
      <input v-model="form.password" class="input" password placeholder="至少 8 位密码" />
    </view>

    <view class="field">
      <text class="label">昵称</text>
      <input v-model.trim="form.nickname" class="input" placeholder="2 到 20 个字符" />
    </view>

    <view class="field">
      <text class="label">出生年份</text>
      <input v-model="birthYearText" class="input" type="number" placeholder="例如 1998" />
    </view>

    <view class="field">
      <text class="label">邀请码</text>
      <input v-model.trim="form.invite_code" class="input" placeholder="选填" />
    </view>

    <label class="agreement">
      <checkbox :checked="form.accepted_terms" @click="form.accepted_terms = !form.accepted_terms" />
      <text>我已阅读并同意用户协议和隐私政策</text>
    </label>

    <text v-if="errorMessage" class="error">{{ errorMessage }}</text>

    <button class="primary-button" :disabled="submitting" @click="handleRegister">
      {{ submitting ? '创建中' : '注册并登录' }}
    </button>

    <button class="text-button login-link" @click="goLogin">已有账号，去登录</button>
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
  uni.navigateBack({
    fail: () => uni.reLaunch({ url: '/pages/login/index' }),
  })
}
</script>

<style scoped>
.header {
  margin-bottom: 48rpx;
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
  margin-top: 10rpx;
  color: #596579;
  font-size: 26rpx;
  line-height: 40rpx;
}

.agreement {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin: 8rpx 0 28rpx;
  color: #526070;
  font-size: 26rpx;
  line-height: 38rpx;
}

.login-link {
  margin-top: 28rpx;
}
</style>
