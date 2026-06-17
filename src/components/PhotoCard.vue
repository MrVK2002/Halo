<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const loaded = ref(false)
const failed = ref(false)

// 错落延迟，前 12 张立刻铺开，后续每张递增 40ms
const delay = computed(() => {
  return `${Math.min(props.index, 12) * 40}ms`
})

function onLoad() {
  loaded.value = true
}

function onError() {
  failed.value = true
  loaded.value = true
}
</script>

<template>
  <div
    class="photo-card"
    :class="{ 'is-loaded': loaded, 'is-failed': failed }"
    :style="{ '--stagger-delay': delay, aspectRatio: `${item.width} / ${item.height}` }"
  >
    <!-- 骨架屏（直角矩形 + shimmer 渐变动画） -->
    <div v-if="!loaded" class="photo-card__skeleton" aria-hidden="true"></div>

    <!-- 真实图片（瓦片铺开动画） -->
    <img
      v-if="!failed"
      class="photo-card__img"
      :src="item.src"
      :alt="item.alt"
      loading="lazy"
      decoding="async"
      @load="onLoad"
      @error="onError"
    />

    <!-- 失败占位 -->
    <div v-else class="photo-card__error" aria-hidden="true">图片加载失败</div>
  </div>
</template>

<style scoped>
.photo-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--c-mist);
  cursor: pointer;
  /* 瓦片铺开动画（scale + opacity） */
  opacity: 0;
  transform: scale(0.96);
  transition:
    transform 0.22s var(--ease-out),
    box-shadow 0.22s var(--ease-out);
  will-change: transform, opacity;
}

.photo-card.is-loaded {
  animation: tileSpread 0.5s var(--ease-out) forwards;
  animation-delay: var(--stagger-delay, 0ms);
}

.photo-card:hover {
  transform: scale(1.03);
  box-shadow: 4px 8px 20px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.photo-card__skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--c-shimmer-from) 0%,
    var(--c-shimmer-to) 50%,
    var(--c-shimmer-from) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}

.photo-card__img {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.photo-card__error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--c-mid);
  background: var(--c-mist);
}

@keyframes tileSpread {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 尊重无障碍偏好 */
@media (prefers-reduced-motion: reduce) {
  .photo-card {
    opacity: 1;
    transform: none;
    animation: none !important;
  }
  .photo-card:hover {
    transform: none;
  }
  .photo-card__skeleton {
    animation: none;
  }
}
</style>
