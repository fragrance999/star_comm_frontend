<template>
  <view class="spirit-avatar" :class="`size-${size}`" :style="avatarStyle" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { AppearanceType, SpiritEmotion } from '@/types/spirit'

const props = withDefaults(
  defineProps<{
    appearance: AppearanceType
    emotion?: SpiritEmotion
    size?: 'small' | 'medium' | 'large'
  }>(),
  { emotion: 'default', size: 'medium' },
)

const imageMap: Record<AppearanceType, string> = {
  STARLIGHT: '/static/spirits/starlight-sprites.png',
  FOX: '/static/spirits/fox-sprites.png',
  OTTER: '/static/spirits/otter-sprites.png',
  ROBOT: '/static/spirits/robot-sprites.png',
}

const positionMap: Record<SpiritEmotion, string> = {
  default: '0% 0%',
  joy: '100% 0%',
  thinking: '0% 100%',
  comfort: '100% 100%',
}

const avatarStyle = computed(() => ({
  backgroundImage: `url(${imageMap[props.appearance]})`,
  backgroundPosition: positionMap[props.emotion],
}))
</script>

<style scoped>
.spirit-avatar {
  flex: 0 0 auto;
  width: 180rpx;
  height: 180rpx;
  background-repeat: no-repeat;
  background-size: 200% 200%;
}

.size-small {
  width: 84rpx;
  height: 84rpx;
}

.size-large {
  width: 330rpx;
  height: 330rpx;
}
</style>
