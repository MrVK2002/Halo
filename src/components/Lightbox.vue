<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import gsap from 'gsap'
import { useLightbox } from '@/composables/useLightbox.js'
import { PHOTO_CATEGORIES } from '@/data/photos.js'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['close'])

const { state, current, counter, open, close, next, prev } = useLightbox()

// 图片加载状态
const isLoading = ref(true)
const showLoadingIndicator = ref(false)
let loadingTimer = null

function onImgLoad(e) {
  isLoading.value = false
  clearTimeout(loadingTimer)
  showLoadingIndicator.value = false
  // 过渡结束后（避免动画中途改布局）再恢复自动尺寸
  if (e?.target && e.target === flySizedEl && !isFlyActive.value) restoreImgSize(e.target)
}

function onImgError() {
  isLoading.value = false
  clearTimeout(loadingTimer)
  showLoadingIndicator.value = false
}

/**
 * 从照片墙打开灯箱
 * @param {number} index 图片索引
 * @param {DOMRect|null} originRect 被点击卡片在视口中的矩形，用于「拾起放大」过渡
 */
async function openByIndex(index, originRect) {
  cancelFly()
  open(index, props.items)
  document.body.style.overflow = 'hidden'
  if (!originRect) return

  flyFromRect = originRect
  flyPhase.value = 'lift'
  await nextTick()
  runFlyIn()
}

function onClose() {
  cancelFly()
  exitImmersive()
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

/* —— 下载当前图片（原图） —— */
const isDownloading = ref(false)
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|svg)$/i

/** 下载地址：优先原图（public/images/portfolio 源文件），缺失时退回灯箱大图 */
const downloadUrl = computed(
  () => current.value?.lightbox?.original || current.value?.lightbox?.src || ''
)

/**
 * 生成下载文件名
 * 优先使用原图 URL 中的文件名，其次退回作品标题
 * @returns {string} 文件名
 */
function buildFileName() {
  const rawName = decodeURIComponent(downloadUrl.value.split('?')[0].split('/').pop() || '')
  if (IMAGE_EXT_RE.test(rawName)) return rawName

  const base = current.value?.lightbox?.title || current.value?.alt || 'image'
  // 过滤文件名中的非法字符
  return `${base.replaceAll(/[\\/:*?"<>|]/g, '-')}.jpg`
}

/**
 * 下载当前原图
 * 优先通过 fetch 取 blob 后触发浏览器下载（可保留文件名）；
 * 跨域受限时退化为新窗口打开，由用户手动保存
 */
async function onDownload() {
  const url = downloadUrl.value
  if (!url || isDownloading.value) return

  const fileName = buildFileName()
  isDownloading.value = true
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    // 延迟释放，确保浏览器已开始下载
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  } catch {
    // 图片托管方未开放跨域时，改为新窗口打开
    window.open(url, '_blank', 'noopener')
  } finally {
    isDownloading.value = false
  }
}

/* —— 沉浸模式：鼠标悬停图片 1.5s 后隐藏全部 UI，移出图片立刻恢复 —— */
const isImmersive = ref(false)
/** 悬停多久后进入沉浸模式（ms） */
const IMMERSIVE_DELAY = 1500
let immersiveTimer = null

/** 清除进入沉浸模式的定时器 */
function clearImmersiveTimer() {
  clearTimeout(immersiveTimer)
  immersiveTimer = null
}

/** 退出沉浸模式并取消待触发的定时器 */
function exitImmersive() {
  clearImmersiveTimer()
  isImmersive.value = false
}

/** 鼠标进入图片：延迟进入沉浸模式 */
function onImageEnter() {
  clearImmersiveTimer()
  immersiveTimer = setTimeout(() => {
    isImmersive.value = true
  }, IMMERSIVE_DELAY)
}

/** 鼠标移出图片：立即恢复全部图标 */
function onImageLeave() {
  exitImmersive()
}

/* —— 「拾起放大」两段式过渡 ——
 * 阶段一 lift：图片从照片墙卡片位置脱离，移动到视口正中，同时背景逐渐高斯模糊
 * 阶段二 enter：图片继续放大进入灯箱最终位置，灯箱背景与操作 UI 淡入
 */
const flyPhase = ref('') // '' | 'lift' | 'enter'
/** 是否处于入场过渡中（隐藏叠加 UI、禁用图片切换过渡） */
const isFlyActive = computed(() => flyPhase.value !== '')
/** 背景是否已进入高斯模糊态（由 CSS 过渡完成动画） */
const pageBlurOn = ref(false)
/** 灯箱主图元素，作为 FLIP 的终点测量对象 */
const mainImgRef = ref(null)
/** 阶段一：脱离、移动到视口正中并放大到灯箱最终尺寸的时长（秒） */
const LIFT_DURATION = 0.75
/** 阶段二：切入灯箱（位置微调 + 背景/UI 淡入）的时长（秒） */
const ENTER_DURATION = 0.45
/** 卡片缩略图在视口中的起始矩形 */
let flyFromRect = null
/** 正在做 FLIP 的主图元素 */
let flyEl = null
/** 过渡时间轴 */
let flyTl = null
/** 过渡期间被临时写入固定尺寸的主图元素（等图片加载后恢复自动尺寸） */
let flySizedEl = null

/** 恢复主图的自动尺寸 */
function restoreImgSize(img) {
  if (!img) return
  img.style.width = ''
  img.style.height = ''
  flySizedEl = null
}

/**
 * 计算主图在灯箱中的最终显示尺寸
 * 与 .lb__img 的 max-width / max-height 约束保持一致
 */
function getDisplaySize() {
  const naturalW = current.value?.lightbox?.width || 3
  const naturalH = current.value?.lightbox?.height || 4
  const isMobile = window.innerWidth <= 768
  // 左右 padding：桌面 24 * 2，移动端 12 * 2
  const maxW = window.innerWidth - (isMobile ? 24 : 48)
  // 上下 padding + 图注预留：桌面/移动端均为 128
  const maxH = window.innerHeight - 128
  const scale = Math.min(1, maxW / naturalW, maxH / naturalH)
  return { width: naturalW * scale, height: naturalH * scale }
}

/** 结束过渡：清理内联样式并恢复叠加 UI */
function cancelFly() {
  if (flyTl) {
    flyTl.kill()
    flyTl = null
  }
  if (flyEl) {
    gsap.killTweensOf(flyEl)
    gsap.set(flyEl, { clearProps: 'transform,borderRadius' })
  }
  // 图片已就绪时恢复自动尺寸（未就绪则等 load 事件）
  if (flySizedEl && flySizedEl.complete && flySizedEl.naturalWidth > 0) {
    restoreImgSize(flySizedEl)
  }
  flyEl = null
  flyFromRect = null
  pageBlurOn.value = false
  flyPhase.value = ''
}

/** 阶段二：图片已放大到灯箱尺寸，切入灯箱（位置微调 + 背景/UI 淡入） */
function enterLightbox(img) {
  if (flyEl !== img) return
  flyPhase.value = 'enter'
  pageBlurOn.value = false
  gsap.to(img, {
    x: 0,
    y: 0,
    scale: 1,
    borderRadius: '0px',
    duration: ENTER_DURATION,
    ease: 'sine.inOut',
    clearProps: 'transform,borderRadius',
    onComplete: () => {
      if (flyEl === img) cancelFly()
    }
  })
}

/**
 * 执行两段式 FLIP
 * - 起点：卡片矩形（按目标尺寸等比换算的位移与缩放）
 * - 中间点：视口正中，且已放大到灯箱最终尺寸
 * - 终点：主图在灯箱中的实际布局位置
 */
function runFlyIn() {
  const img = mainImgRef.value
  if (!img || !flyFromRect) {
    cancelFly()
    return
  }

  // 原图未加载完成时主图没有布局尺寸，先按约束写死最终尺寸，保证终点可测量
  if (!img.naturalWidth) {
    const { width, height } = getDisplaySize()
    img.style.width = `${width}px`
    img.style.height = `${height}px`
    flySizedEl = img
  }

  const target = img.getBoundingClientRect()
  if (!target.width || !target.height) {
    cancelFly()
    return
  }

  const { left, top, width, height } = flyFromRect
  const startScale = width / target.width
  // 相对主图自身中心点的位移
  const startX = left + width / 2 - (target.left + target.width / 2)
  const startY = top + height / 2 - (target.top + target.height / 2)
  const centerX = window.innerWidth / 2 - (target.left + target.width / 2)
  const centerY = window.innerHeight / 2 - (target.top + target.height / 2)

  flyEl = img
  flyPhase.value = 'lift'
  pageBlurOn.value = true

  // 瞬移到卡片位置，避免先闪在最终位置
  gsap.set(img, { x: startX, y: startY, scale: startScale, borderRadius: '8px' })

  flyTl = gsap.timeline()
  flyTl.to(img, {
    x: centerX,
    y: centerY,
    scale: 1,
    borderRadius: '0px',
    duration: LIFT_DURATION,
    ease: 'power2.out'
  })
  flyTl.add(() => enterLightbox(img))
}

/** 过渡期间用照片墙已加载的图片垫底，避免原图未就绪时飞行中显示空框 */
const flyBgStyle = computed(() => {
  const src = current.value?.src || current.value?.thumb
  if (!src) return null
  return {
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

watch(
  () => [state.isOpen, state.index],
  ([open, idx]) => {
    if (!open) return
    exitImmersive()
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
  clearImmersiveTimer()
  cancelFly()
})

/* —— 作品集信息（左上角） —— */
const CATEGORY_MAP = new Map(PHOTO_CATEGORIES.map((c) => [c.key, c]))

const collection = computed(() => {
  const category = CATEGORY_MAP.get(current.value?.category)
  if (!category) return ''
  return `${category.labelEN.toUpperCase()} - ${category.labelCN}`
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
  <Transition name="lb-fade" :css="!isFlyActive">
    <div
      v-if="state.isOpen && current"
      class="lb"
      :class="{
        'lb--immersive': isImmersive,
        'lb--flying': isFlyActive,
        'lb--lift': flyPhase === 'lift'
      }"
      role="dialog"
      aria-modal="true"
      :aria-label="current.lightbox.title || current.alt"
      @click.self="onClose"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <!-- 背景高斯模糊层：图片脱离过程中逐渐虚化整个页面 -->
      <div class="lb__page-blur" :class="{ 'is-on': pageBlurOn }" aria-hidden="true" />

      <!-- 背景：以当前图片为基底的高斯模糊 -->
      <div class="lb__bg">
        <Transition name="lb-bg">
          <img
            :key="current.id"
            class="lb__bg-img"
            :src="current.thumb || current.lightbox.src"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        </Transition>
        <div class="lb__bg-veil" />
      </div>

      <div v-if="collection" class="lb__collection">{{ collection }}</div>

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

      <button
        class="lb__btn lb__btn--download"
        type="button"
        aria-label="下载原图"
        :aria-busy="isDownloading"
        :disabled="isDownloading"
        @click="onDownload"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M12 4v10m-4-4l4 4 4-4M5 19h14"
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

          <Transition name="lb-img" mode="out-in" :css="!isFlyActive">
            <img
              ref="mainImgRef"
              :key="current.id"
              class="lb__img"
              :src="current.lightbox.src"
              :alt="current.alt || current.lightbox.title"
              :width="current.lightbox.width"
              :height="current.lightbox.height"
              :style="isFlyActive ? flyBgStyle : null"
              draggable="false"
              @load="onImgLoad"
              @error="onImgError"
              @mouseenter="onImageEnter"
              @mouseleave="onImageLeave"
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

/* 背景高斯模糊层：图片脱墙过程中逐渐虚化整个页面
 * 模糊半径保持恒定、只淡入淡出，避免逐帧重算 backdrop-filter 造成掉帧
 */
.lb__page-blur {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.3);
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  transition: opacity 0.65s ease-out;
}

.lb__page-blur.is-on {
  opacity: 1;
}

/* 背景：以当前图片为基底的高斯模糊 */
.lb__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #000;
  cursor: default;
  transition: opacity 0.45s ease-out;
}

/* 脱离阶段先隐藏灯箱背景，等进入灯箱时再淡入 */
.lb--lift .lb__bg {
  opacity: 0;
}

/* 放大并外扩，避免模糊后边缘透出黑边 */
.lb__bg-img {
  position: absolute;
  inset: -20%;
  width: 140%;
  height: 140%;
  object-fit: cover;
  filter: blur(48px) saturate(115%) brightness(0.75);
  transform: scale(1.05);
}

/* 压暗遮罩，保证前景图片与文字的对比度 */
.lb__bg-veil {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
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

.lb__btn--download {
  top: 16px;
  right: 64px;
}

.lb__btn:disabled {
  opacity: 0.4;
  cursor: progress;
}

/* —— 沉浸模式 / 脱离阶段：隐藏全部叠加 UI（进入灯箱阶段淡入） —— */
.lb--immersive .lb__btn,
.lb--immersive .lb__counter,
.lb--immersive .lb__collection,
.lb--immersive .lb__caption,
.lb--lift .lb__btn,
.lb--lift .lb__counter,
.lb--lift .lb__collection,
.lb--lift .lb__caption {
  opacity: 0;
  pointer-events: none;
}

/* 整个过渡期间都不显示加载动画，避免与飞行动画叠加 */
.lb--flying .lb__loading {
  opacity: 0;
  pointer-events: none;
}

/* 过渡期间提升合成层，保证位移/缩放动画流畅 */
.lb--flying .lb__img {
  will-change: transform;
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
  right: 16px;
  bottom: 16px;
  z-index: 2;
  font-family: var(--font-mono);
  font-size: 15px;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  transition: opacity 0.3s ease-out;
}

/* 作品集信息：左上角，中英文统一使用思源黑体 */
.lb__collection {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  font-family: var(--font-hans);
  font-size: 15px;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.7);
  /* 预留右上角关闭/下载按钮的空间，过长时省略 */
  max-width: calc(100% - 140px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s ease-out;
}

.lb__caption {
  position: relative;
  width: 100%;
  padding: 10px 0 0;
  text-align: left;
  color: #fff;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
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

/* 背景随图片切换交叉淡入淡出 */
.lb-bg-enter-active,
.lb-bg-leave-active {
  transition: opacity 0.45s ease-out;
}
.lb-bg-enter-from,
.lb-bg-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .lb-fade-enter-active,
  .lb-fade-leave-active,
  .lb-img-enter-active,
  .lb-img-leave-active,
  .lb-bg-enter-active,
  .lb-bg-leave-active { transition: none; }
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
    padding: 64px 12px 64px;
    align-items: center;
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
    max-height: calc(100vh - 128px);
    max-height: calc(100dvh - 128px);
  }

  .lb__img {
    max-height: calc(100vh - 128px);
    max-height: calc(100dvh - 128px);
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
    right: 14px;
    bottom: 14px;
    font-size: 13px;
  }

  .lb__btn--close {
    top: 14px;
    right: 14px;
  }

  .lb__btn--download {
    top: 14px;
    right: 60px;
  }

  .lb__collection {
    top: 14px;
    left: 14px;
    font-size: 13px;
  }
}
</style>
