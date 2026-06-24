<script setup>
import { LazyImg } from 'vue-waterfall-plugin-next'

const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, default: 0 },
  isHovered: { type: Boolean, default: false },
  tiltX: { type: String, default: '0deg' },
  tiltY: { type: String, default: '0deg' }
})

const emit = defineEmits(['mouse-move', 'mouse-enter', 'mouse-leave', 'click'])
</script>

<template>
  <div
    class="waterfall-card"
    :class="{ 'is-hovered': isHovered }"
    :style="{
      '--stagger-delay': Math.min(index, 12) * 40 + 'ms',
      '--tilt-x': tiltX,
      '--tilt-y': tiltY
    }"
    @mousemove="(e) => emit('mouse-move', e)"
    @mouseenter="() => emit('mouse-enter')"
    @mouseleave="() => emit('mouse-leave')"
    @click="() => emit('click')"
  >
    <LazyImg
      :url="item.src"
      :ratio="(item.height || 4) / (item.width || 5)"
      class="waterfall-card__img"
    />
    <!-- 高光层：模拟光从上方斜照到被抬起的纸面 -->
    <div class="waterfall-card__sheen" aria-hidden="true" />
  </div>
</template>

<style scoped>
.waterfall-card {
  position: relative;
  overflow: hidden;
  background: var(--c-mist);
  cursor: pointer;
  opacity: 0;
  transform: scale(0.96);
  animation: fadeIn 0.5s var(--ease-out) forwards;
  animation-delay: var(--stagger-delay, 0ms);
  transform-style: preserve-3d;
  perspective: 1000px;
  transform-origin: center center;
  transition:
    transform 0.4s cubic-bezier(0.2, 0.85, 0.3, 1.15),
    box-shadow 0.4s cubic-bezier(0.2, 0.85, 0.3, 1.15);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  will-change: transform, box-shadow;
}

.waterfall-card.is-hovered {
  transform:
    translateZ(20px)
    rotateX(var(--tilt-x))
    rotateY(var(--tilt-y))
    scale(1.06);
  box-shadow:
    0 14px 28px -10px rgba(0, 0, 0, 0.28),
    0 28px 56px -14px rgba(0, 0, 0, 0.18);
  z-index: 10;
}

.waterfall-card__sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(
    115deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0) 35%,
    rgba(0, 0, 0, 0.08) 100%
  );
  mix-blend-mode: overlay;
}

.waterfall-card.is-hovered .waterfall-card__sheen {
  opacity: 1;
}

.waterfall-card__img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .waterfall-card {
    opacity: 1;
    transform: none;
    animation: none !important;
  }
  .waterfall-card.is-hovered {
    transform: none;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }
  .waterfall-card__sheen {
    display: none;
  }
}
</style>
