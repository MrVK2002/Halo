<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useLightbox } from '@/composables/useLightbox.js'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['close'])

const { state, current, counter, open, close, next, prev } = useLightbox()

// 图片加载状态
const isLoading = ref(true)
const showLoadingIndicator = ref(false)
let loadingTimer = null

function onImgLoad() {
  isLoading.value = false
  clearTimeout(loadingTimer)
  showLoadingIndicator.value = false
}

function onImgError() {
  isLoading.value = false
  clearTimeout(loadingTimer)
  showLoadingIndicator.value = false
}

function openByIndex(index) {
  open(index, props.items)
  document.body.style.overflow = 'hidden'
}

function onClose() {
  close()
  document.body.style.overflow = ''
  emit('close')
}

function onKeydown(e) {
  if (!state.isOpen) return
  if (e.key === 'Escape') onClose()
  else if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

/* —— 触屏滑动切换 —— */
let touchStartX = 0
let touchStartY = 0
let touchDeltaX = 0
let touchDeltaY = 0

function onTouchStart(e) {
  if (e.touches.length !== 1) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  touchDeltaX = 0
  touchDeltaY = 0
}

function onTouchMove(e) {
  if (e.touches.length !== 1) return
  touchDeltaX = e.touches[0].clientX - touchStartX
  touchDeltaY = e.touches[0].clientY - touchStartY
}

function onTouchEnd() {
  /* 仅做横向滑动切换：>50px 且横向占绝对优势 */
  if (Math.abs(touchDeltaX) > 50 && Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
    if (touchDeltaX < 0) next()
    else prev()
  }
  touchDeltaX = 0
  touchDeltaY = 0
}

function preload(adjIndex) {
  const item = state.items[adjIndex]
  if (!item) return
  const img = new Image()
  img.src = item.lightbox.src
}

watch(
  () => [state.isOpen, state.index],
  ([open, idx]) => {
    if (!open) return
    isLoading.value = true
    showLoadingIndicator.value = false
    preload(idx + 1)
    preload(idx - 1)
    loadingTimer = setTimeout(() => {
      if (isLoading.value) {
        showLoadingIndicator.value = true
      }
    }, 500)
  }
)

watch(
  () => state.isOpen,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  clearTimeout(loadingTimer)
})

const exifFields = computed(() => {
  const exif = current.value?.lightbox?.exif
  if (!exif) return []
  const fields = [exif.camera, exif.aperture, exif.shutter, exif.iso].filter(Boolean)
  return fields
})

const exifDate = computed(() => {
  const dateStr = current.value?.lightbox?.exif?.date
  if (!dateStr) return null
  return dateStr.replace(/\./g, '-')
})

const hasMany = computed(() => state.items.length > 1)

defineExpose({ openByIndex })
</script>

<template>
  <Transition name="lb-fade">
    <div
      v-if="state.isOpen && current"
      class="lb"
      role="dialog"
      aria-modal="true"
      :aria-label="current.lightbox.title || current.alt"
      @click.self="onClose"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <div class="lb__bg" />

      <button class="lb__btn lb__btn--close" type="button" aria-label="关闭" @click="onClose">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M5 5l14 14M19 5L5 19"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="square"
          />
        </svg>
      </button>

      <div v-if="hasMany" class="lb__counter">{{ counter }}</div>

      <button
        v-if="hasMany"
        class="lb__btn lb__btn--nav lb__btn--prev"
        type="button"
        aria-label="上一张"
        @click="prev"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path
            d="M15 4l-8 8 8 8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="square"
            stroke-linejoin="miter"
          />
        </svg>
      </button>

      <button
        v-if="hasMany"
        class="lb__btn lb__btn--nav lb__btn--next"
        type="button"
        aria-label="下一张"
        @click="next"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path
            d="M9 4l8 8-8 8"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="square"
            stroke-linejoin="miter"
          />
        </svg>
      </button>

      <div class="lb__frame">
        <div class="lb__stage">
          <div v-if="showLoadingIndicator" class="lb__loading">
            <div class="three-body">
              <div class="three-body__dot"></div>
              <div class="three-body__dot"></div>
              <div class="three-body__dot"></div>
            </div>
          </div>

          <Transition name="lb-img" mode="out-in">
            <img
              :key="current.id"
              class="lb__img"
              :src="current.lightbox.src"
              :alt="current.alt || current.lightbox.title"
              :width="current.lightbox.width"
              :height="current.lightbox.height"
              draggable="false"
              @load="onImgLoad"
              @error="onImgError"
            />
          </Transition>
        </div>

        <figcaption v-if="current.lightbox.title || exifFields.length" class="lb__caption">
          <div v-if="current.lightbox.title || exifDate" class="lb__caption-title">
            {{ current.lightbox.title }}<template v-if="current.lightbox.title && exifDate"> | </template>{{ exifDate }}
          </div>
          <div v-if="exifFields.length" class="lb__caption-exif">
            {{ exifFields.join(' ') }}
          </div>
        </figcaption>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 90px 24px 80px;
}

.lb__bg {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0.96;
  cursor: default;
}

/* 按钮：直角、白色 70% 不透明 */
.lb__btn {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  border-radius: 0;
  color: #fff;
  opacity: 0.7;
  cursor: pointer;
  padding: 12px;
  transition: opacity 0.2s ease-out, background-color 0.2s ease-out;
  font: inherit;
}
.lb__btn:hover,
.lb__btn:focus-visible {
  opacity: 1;
  outline: none;
}
.lb__btn:focus-visible {
  background-color: rgba(255, 255, 255, 0.08);
}

.lb__btn--close {
  top: 16px;
  right: 16px;
}

.lb__btn--nav {
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
}
.lb__btn--prev {
  left: 16px;
}
.lb__btn--next {
  right: 16px;
}

.lb__frame {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.lb__stage {
  position: relative;
  max-width: 100%;
  max-height: calc(100vh - 24px - 80px);
  max-height: calc(100dvh - 24px - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb__loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  opacity: 0;
  animation: loadingFadeIn 0.4s ease-out forwards;
}

@keyframes loadingFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.three-body {
  --uib-size: 35px;
  --uib-speed: 0.8s;
  --uib-color: rgba(255, 255, 255, 0.8);
  position: relative;
  display: inline-block;
  height: var(--uib-size);
  width: var(--uib-size);
  animation: spin78236 calc(var(--uib-speed) * 2.5) infinite linear;
}

.three-body__dot {
  position: absolute;
  height: 100%;
  width: 30%;
}

.three-body__dot::after {
  content: '';
  position: absolute;
  height: 0%;
  width: 100%;
  padding-bottom: 100%;
  background-color: var(--uib-color);
  border-radius: 50%;
}

.three-body__dot:nth-child(1) { bottom: 5%; left: 0; transform: rotate(60deg); transform-origin: 50% 85%; }
.three-body__dot:nth-child(1)::after { bottom: 0; left: 0; animation: wobble1 var(--uib-speed) infinite ease-in-out; animation-delay: calc(var(--uib-speed) * -0.3); }
.three-body__dot:nth-child(2) { bottom: 5%; right: 0; transform: rotate(-60deg); transform-origin: 50% 85%; }
.three-body__dot:nth-child(2)::after { bottom: 0; left: 0; animation: wobble1 var(--uib-speed) infinite calc(var(--uib-speed) * -0.15) ease-in-out; }
.three-body__dot:nth-child(3) { bottom: -5%; left: 0; transform: translateX(116.666%); }
.three-body__dot:nth-child(3)::after { top: 0; left: 0; animation: wobble2 var(--uib-speed) infinite ease-in-out; }

@keyframes spin78236 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes wobble1 { 0%, 100% { transform: translateY(0%) scale(1); opacity: 1; } 50% { transform: translateY(-66%) scale(0.65); opacity: 0.8; } }
@keyframes wobble2 { 0%, 100% { transform: translateY(0%) scale(1); opacity: 1; } 50% { transform: translateY(66%) scale(0.65); opacity: 0.8; } }

.lb__img {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 48px - 80px);
  max-height: calc(100dvh - 48px - 80px);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0;
  user-select: none;
  -webkit-user-drag: none;
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.6);
}

.lb__counter {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  font-family: var(--font-mono);
  font-size: 15px;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.lb__caption {
  position: relative;
  width: 100%;
  padding: 10px 0 0;
  text-align: left;
  color: #fff;
  pointer-events: none;
}

.lb__caption-title {
  font-family: var(--font-hans);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2px;
}

.lb__caption-exif {
  font-family: var(--font-elegance);
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: none;
}

/* —— 过渡 —— */
.lb-fade-enter-active,
.lb-fade-leave-active {
  transition: opacity 0.28s ease-out;
}
.lb-fade-enter-from,
.lb-fade-leave-to { opacity: 0; }

.lb-img-enter-active,
.lb-img-leave-active {
  transition: opacity 0.32s ease-out, transform 0.32s var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}
.lb-img-enter-from { opacity: 0; transform: scale(0.97); }
.lb-img-leave-to { opacity: 0; transform: scale(1.02); }

@media (prefers-reduced-motion: reduce) {
  .lb-fade-enter-active,
  .lb-fade-leave-active,
  .lb-img-enter-active,
  .lb-img-leave-active { transition: none; }
  .lb-img-enter-from,
  .lb-img-leave-to { transform: none; }
}

/* ====================================================================
   移动端 ——
   - 顶部 nav 区压缩
   - 左右切换按钮放大更易点
   - 改为底部 caption，避开导航按钮
   - 加底部安全区适配
==================================================================== */
@media (max-width: 768px) {
  .lb {
    padding: 56px 12px calc(20px + env(safe-area-inset-bottom, 0));
    align-items: flex-start;
  }

  .lb__btn--nav {
    width: 44px;
    height: 44px;
    padding: 8px;
  }

  .lb__btn--prev {
    left: 6px;
  }

  .lb__btn--next {
    right: 6px;
  }

  .lb__stage {
    max-height: calc(100vh - 96px - 80px);
    max-height: calc(100dvh - 96px - 80px);
  }

  .lb__img {
    max-height: calc(100vh - 96px - 80px);
    max-height: calc(100dvh - 96px - 80px);
  }

  .lb__caption {
    padding: 8px 0 0;
  }

  .lb__caption-title {
    font-size: 13px;
  }

  .lb__caption-exif {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .lb__counter {
    top: 14px;
    left: 14px;
    font-size: 13px;
  }

  .lb__btn--close {
    top: 14px;
    right: 14px;
  }
}
</style>
