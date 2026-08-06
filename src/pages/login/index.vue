<template>
  <view class="page auth-page">
    <view class="brand">
      <text class="title">星邻社</text>
      <text class="subtitle">让星灵陪你开启新的关系</text>
    </view>

    <view class="form">
      <view class="field">
        <text class="label">账号或邮箱</text>
        <input v-model.trim="form.account" class="input" placeholder="请输入账号或邮箱" />
      </view>

      <view class="field">
        <text class="label">密码</text>
        <input v-model="form.password" class="input" password placeholder="至少 8 位密码" />
      </view>

      <text v-if="errorMessage" class="error">{{ errorMessage }}</text>

      <button class="primary-button" :disabled="submitting" @click="handleLogin">
        {{ submitting ? '登录中' : '登录' }}
      </button>

      <button class="text-button register-link" @click="goRegister">创建新账号</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const submitting = ref(false)
const errorMessage = ref('')
const form = reactive({
  account: '',
  password: '',
})

async function handleLogin() {
  errorMessage.value = ''
  if (!form.account || form.password.length < 8) {
    errorMessage.value = '请输入账号和至少 8 位密码'
    return
  }

  submitting.value = true
  try {
    await authStore.login(form)
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败'
  } finally {
    submitting.value = false
  }
}

function goRegister() {
  uni.navigateTo({ url: '/pages/register/index' })
}
</script>

<style scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand {
  margin-bottom: 72rpx;
}

.title {
  display: block;
  color: #1f2933;
  font-size: 56rpx;
  font-weight: 700;
  line-height: 72rpx;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  color: #596579;
  font-size: 28rpx;
  line-height: 42rpx;
}

.form {
  width: 100%;
}

.register-link {
  margin-top: 32rpx;
}
</style>
