<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  isHovered: { type: Boolean, default: false },
  tiltX: { type: String, default: '0deg' },
  tiltY: { type: String, default: '0deg' }
})

const emit = defineEmits(['mouse-move', 'mouse-enter', 'mouse-leave', 'click'])

const aspectRatio = (props.item.height || 4) / (props.item.width || 3)

/** 清晰图是否已完成加载 */
const loaded = ref(false)
const mainImgRef = ref(null)

function onLoad() {
  loaded.value = true
}

/** 加载失败也结束占位态，避免一直停留在模糊层 */
function onError() {
  loaded.value = true
}

onMounted(() => {
  // 命中缓存时 load 事件可能早于监听，这里补一次判断
  const el = mainImgRef.value
  if (el?.complete && el.naturalWidth > 0) {
    loaded.value = true
  }
})

/* 触屏判定：避免在移动端触发 3D 倾斜动画（体验不佳） */
const isTouch =
  typeof window !== 'undefined' &&
  (('ontouchstart' in window) ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0)

function onClick() {
  emit('click')
}

function onTouchStart() {
  /* 触发短暂的"active"放大效果 */
  emit('mouse-enter')
}

function onTouchEnd() {
  emit('mouse-leave')
}
</script>

<template>
  <div
    class="waterfall-card"
    :class="[
      { 'is-hovered': isHovered },
      { 'is-touch': isTouch }
    ]"
    :style="{
      '--tilt-x': tiltX,
      '--tilt-y': tiltY
    }"
    @mousemove="(e) => emit('mouse-move', e)"
    @mouseenter="() => emit('mouse-enter')"
    @mouseleave="() => emit('mouse-leave')"
    @click="onClick"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    @touchcancel.passive="onTouchEnd"
  >
    <div
      class="waterfall-card__img-wrap"
      :style="{ paddingBottom: (aspectRatio * 100) + '%' }"
    >
      <!-- 低分辨率占位：24px base64 模糊图，尺寸由外层比例盒锁定 -->
      <img
        v-if="item.placeholder"
        :src="item.placeholder"
        class="waterfall-card__img waterfall-card__img--placeholder"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <!-- 清晰图：加载完成后淡入覆盖占位图 -->
      <img
        ref="mainImgRef"
        :src="item.src"
        :alt="item.alt || item.title || 'Gallery'"
        class="waterfall-card__img waterfall-card__img--main"
        :class="{ 'is-loaded': loaded }"
        loading="lazy"
        decoding="async"
        draggable="false"
        @load="onLoad"
        @error="onError"
      />
    </div>
    <div class="waterfall-card__sheen" aria-hidden="true" />
  </div>
</template>

<style scoped>
.waterfall-card {
  position: relative;
  overflow: hidden;
  background: var(--c-mist);
  /* 圆角由容器裁剪，内部图片与高光层会一起贴合 */
  border-radius: 8px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform-origin: center center;
  transition:
    transform 0.4s cubic-bezier(0.2, 0.85, 0.3, 1.15),
    box-shadow 0.4s cubic-bezier(0.2, 0.85, 0.3, 1.15);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  height: 100%;
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

.waterfall-card__img-wrap {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
}

.waterfall-card__img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
  display: block;
}

/* 模糊占位：小图放大 + 高斯模糊，轻微 overflow 裁掉模糊边缘 */
.waterfall-card__img--placeholder {
  filter: blur(18px);
  transform: scale(1.08);
  z-index: 0;
}

/* 清晰图淡入覆盖占位图 */
.waterfall-card__img--main {
  opacity: 0;
  z-index: 1;
  transition: opacity 0.5s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.waterfall-card__img--main.is-loaded {
  opacity: 1;
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

/* ====================================================================
   触屏设备：去掉 3D 倾斜 / z 轴位移，只保留简单的轻微缩放反馈
==================================================================== */
.is-touch.is-hovered,
.is-touch:active {
  transform: scale(0.97);
  box-shadow:
    0 6px 14px -6px rgba(0, 0, 0, 0.20),
    0 14px 28px -10px rgba(0, 0, 0, 0.12);
}

.is-touch .waterfall-card__sheen {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .waterfall-card {
    transform: none !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }
  .waterfall-card__sheen {
    display: none;
  }
  .waterfall-card__img--main {
    transition: none;
  }
}
</style>
