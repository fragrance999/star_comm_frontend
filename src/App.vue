<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

import { useAuthStore } from '@/stores/auth'

onLaunch(() => {
  const authStore = useAuthStore()
  authStore.restore()
})
</script>

<style>
page {
  min-height: 100%;
  background: #07070e;
  color: #f2efe6;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
}

button {
  margin: 0;
  padding: 0;
}

button::after {
  border: 0;
}

.page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 56rpx 36rpx;
  background:
    linear-gradient(rgba(135, 121, 255, 0.06) 2rpx, transparent 2rpx),
    linear-gradient(90deg, rgba(135, 121, 255, 0.06) 2rpx, transparent 2rpx),
    #07070e;
  background-size: 96rpx 96rpx;
}

.primary-button {
  width: 100%;
  height: 96rpx;
  border: 0;
  border-radius: 16rpx;
  background: #f2efe6;
  color: #101018;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 96rpx;
  letter-spacing: 2rpx;
  box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.25);
}

.secondary-button {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid rgba(217, 212, 255, 0.28);
  border-radius: 16rpx;
  background: rgba(18, 18, 31, 0.88);
  color: #e6e1ff;
  font-size: 30rpx;
  font-weight: 500;
  line-height: 84rpx;
}

.text-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #bdb5ff;
  font-size: 28rpx;
  line-height: 44rpx;
}

.field {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  margin-bottom: 14rpx;
  color: #beb9d2;
  font-size: 24rpx;
  letter-spacing: 1rpx;
}

.input {
  width: 100%;
  height: 92rpx;
  box-sizing: border-box;
  border: 2rpx solid rgba(214, 209, 247, 0.18);
  border-radius: 16rpx;
  background: #0a0a13 !important;
  color: #f2efe6;
  font-size: 30rpx;
  padding: 0 24rpx;
}

.input .uni-input-wrapper,
.input .uni-input-input {
  height: 100%;
  background-color: #0a0a13 !important;
  color: #f2efe6 !important;
}

.input .uni-input-wrapper {
  border-radius: inherit;
}

.input .uni-input-input:focus {
  outline: 0;
}

.input .uni-input-input:-webkit-autofill,
.input .uni-input-input:-webkit-autofill:hover,
.input .uni-input-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #0a0a13 inset !important;
  -webkit-text-fill-color: #f2efe6 !important;
}

.input:focus-within {
  border-color: #9b91ff;
  box-shadow: 0 0 0 6rpx rgba(155, 145, 255, 0.1);
}

.error {
  margin: 22rpx 0;
  color: #ff9ba8;
  font-size: 26rpx;
  line-height: 38rpx;
}

.primary-button[disabled],
.secondary-button[disabled] {
  opacity: 0.5;
}
</style>
