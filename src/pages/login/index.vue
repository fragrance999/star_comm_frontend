<template>
  <view class="page auth-page">
    <view class="brand-intro">
      <image class="brand-mark" src="/static/brand/app-icon.png" mode="aspectFill" />
      <text class="title">星邻社</text>
    </view>

    <view class="form-card">
      <view class="field">
        <input
          v-model.trim="form.account"
          class="input"
          placeholder="账号或邮箱"
          placeholder-style="color: #706f83;"
        />
      </view>

      <view class="field">
        <input
          v-model="form.password"
          class="input"
          password
          placeholder="密码"
          placeholder-style="color: #706f83;"
        />
      </view>

      <text v-if="errorMessage" class="error">{{ errorMessage }}</text>

      <button class="primary-button" :disabled="submitting" @click="handleLogin">
        {{ submitting ? '登录中' : '登录' }}
      </button>

      <view class="register-entry">
        <button
          class="text-button register-link"
          hover-class="register-link--pressed"
          :hover-stay-time="80"
          @click="goRegister"
        >
          创建账号
        </button>
      </view>
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
  padding-top: 48rpx;
  padding-bottom: 48rpx;
}

.brand-intro {
  margin-bottom: 44rpx;
  text-align: center;
}

.brand-mark {
  width: 134rpx;
  height: 134rpx;
  margin: 0 auto 24rpx;
  border: 2rpx solid rgba(240, 236, 255, 0.42);
  border-radius: 30rpx;
  box-shadow: 0 0 48rpx rgba(132, 112, 255, 0.34);
  animation: mark-settle 600ms ease-out both;
}

.title {
  display: block;
  color: #f2efe6;
  font-size: 54rpx;
  font-weight: 700;
  line-height: 68rpx;
  letter-spacing: 4rpx;
  animation: title-rise 500ms 120ms ease-out both;
}

.form-card {
  width: 100%;
  box-sizing: border-box;
  padding: 30rpx;
  border: 2rpx solid rgba(213, 208, 255, 0.2);
  border-radius: 16rpx;
  background: rgba(17, 17, 29, 0.92);
  box-shadow: 0 24rpx 60rpx rgba(0, 0, 0, 0.3);
  animation: form-arrive 520ms 180ms ease-out both;
}

.register-link {
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

.register-entry {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 2rpx solid rgba(213, 208, 255, 0.12);
  text-align: center;
}

.register-link--pressed,
.register-link:active {
  border-color: rgba(220, 214, 255, 0.78);
  background: rgba(150, 136, 255, 0.2);
  color: #f2efe6;
  transform: scale(0.985);
}

@keyframes mark-settle {
  from {
    opacity: 0;
    transform: scale(0.84);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes title-rise {
  from {
    opacity: 0;
    transform: translateY(16rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes form-arrive {
  from {
    opacity: 0;
    transform: translateY(28rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
