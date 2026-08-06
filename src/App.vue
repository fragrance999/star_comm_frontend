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
  background: #f6f4ef;
  color: #1f2933;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", sans-serif;
}

button {
  margin: 0;
}

.page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48rpx 36rpx;
}

.primary-button {
  width: 100%;
  height: 96rpx;
  border: 0;
  border-radius: 8rpx;
  background: #2347ff;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 96rpx;
}

.secondary-button {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #c5cad8;
  border-radius: 8rpx;
  background: #fff;
  color: #26313f;
  font-size: 30rpx;
  line-height: 84rpx;
}

.text-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #2347ff;
  font-size: 28rpx;
  line-height: 44rpx;
}

.field {
  margin-bottom: 28rpx;
}

.label {
  display: block;
  margin-bottom: 12rpx;
  color: #526070;
  font-size: 26rpx;
}

.input {
  width: 100%;
  height: 92rpx;
  box-sizing: border-box;
  border: 2rpx solid #d8dde8;
  border-radius: 8rpx;
  background: #fff;
  color: #1f2933;
  font-size: 30rpx;
  padding: 0 24rpx;
}

.error {
  margin: 24rpx 0;
  color: #b42318;
  font-size: 26rpx;
  line-height: 38rpx;
}
</style>
