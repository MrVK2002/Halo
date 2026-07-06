<script setup>
/**
 * CustomCursor —— 仅一个跟随指针的灰色圆点
 *  - 进入可点击元素时放大 + 变实心（hover 态）
 *  - 进入文本输入框时变竖条
 *  - 进入黑底灯箱时自动反转为浅色（保持可见）
 *  - reduced-motion / touch / coarse-pointer 设备自动放行原生光标
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLightbox } from '@/composables/useLightbox.js'

const { state: lightboxState } = useLightbox()

const enabled = ref(false)
const dotRef = ref(null)

let rafId = 0
let pending = null
const target = { x: 0, y: 0 }
const dot = { x: 0, y: 0 }
let hovering = false
let pressing = false
let visible = true
let inverted = false

const INTERACTIVE = 'a,button,[role="button"],input,textarea,select,label,summary,.menu-item,[data-cursor="pointer"]'
const TEXT_INPUT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]),textarea,[contenteditable="true"]'

function tick() {
  if (!enabled.value) return
  dot.x += (target.x - dot.x) * 0.9
  dot.y += (target.y - dot.y) * 0.9
  if (dotRef.value) {
    const pressingScale = pressing ? 'scale(0.5)' : ''
    dotRef.value.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) ${pressingScale}`
    dotRef.value.style.opacity = visible ? '1' : '0'
    /* 黑底灯箱里用浅色光标保持可见 */
    dotRef.value.dataset.invert = inverted ? '1' : '0'
  }
  rafId = requestAnimationFrame(tick)
}

function detectHoverAt(x, y) {
  const el = document.elementFromPoint(x, y)
  if (!el) {
    hovering = false
    return
  }
  if (el.closest(TEXT_INPUT)) {
    hovering = 'text'
    return
  }
  hovering = !!(el.closest(INTERACTIVE) || el.closest('a'))
}

function onMove(e) {
  if (!enabled.value) return
  target.x = e.clientX
  target.y = e.clientY
  pending && clearTimeout(pending)
  pending = setTimeout(() => detectHoverAt(e.clientX, e.clientY), 16)
  if (!visible) visible = true
}

function onDown() {
  pressing = true
}
function onUp() {
  pressing = false
}
function onLeave() {
  visible = false
}
function onEnter() {
  visible = true
}
function onScroll() {
  visible = false
}

function activate() {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (globalThis.matchMedia('(pointer: coarse)').matches) return
  if (navigator.maxTouchPoints > 0) return
  enabled.value = true
  globalThis.addEventListener('pointermove', onMove, { passive: true })
  globalThis.addEventListener('pointerdown', onDown, { passive: true })
  globalThis.addEventListener('pointerup', onUp, { passive: true })
  globalThis.addEventListener('mouseleave', onLeave)
  globalThis.addEventListener('mouseenter', onEnter)
  globalThis.addEventListener('scroll', onScroll, { passive: true })
  rafId = requestAnimationFrame(tick)
}

/* 灯箱打开时光标颜色反转（黑底→浅色） */
watch(
  () => lightboxState.isOpen,
  (isOpen) => {
    inverted = isOpen
  }
)

function deactivate() {
  enabled.value = false
  globalThis.removeEventListener('pointermove', onMove)
  globalThis.removeEventListener('pointerdown', onDown)
  globalThis.removeEventListener('pointerup', onUp)
  globalThis.removeEventListener('mouseleave', onLeave)
  globalThis.removeEventListener('mouseenter', onEnter)
  globalThis.removeEventListener('scroll', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
}

onMounted(activate)
onBeforeUnmount(deactivate)
</script>

<template>
  <div
    v-if="enabled"
    class="cursor-layer"
    aria-hidden="true"
  >
    <div
      ref="dotRef"
      class="cursor-dot"
      :data-state="hovering === 'text' ? 'text' : hovering ? 'hover' : 'idle'"
    />
  </div>
</template>

<style scoped>
.cursor-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  /* 必须高于 Lightbox (9999) / SideMenu 抽屉 (100) 等所有覆盖层 */
  z-index: 100000;
  contain: layout paint;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  margin: 0;
  background: var(--c-mid, #888);
  border-radius: 50%;
  will-change: transform, width, height, background;
  transition:
    width 0.18s cubic-bezier(0.2, 0.7, 0.2, 1),
    height 0.18s cubic-bezier(0.2, 0.7, 0.2, 1),
    background 0.18s ease,
    border-radius 0.18s ease,
    opacity 0.18s ease;
}

.cursor-dot[data-state='hover'] {
  width: 14px;
  height: 14px;
  background: var(--c-ink, #222);
}

.cursor-dot[data-state='text'] {
  width: 2px;
  height: 18px;
  border-radius: 1px;
  background: var(--c-ink, #222);
}

/* 黑底场景（灯箱打开时）：光标反转为浅色保持可见 */
.cursor-dot[data-invert='1'] {
  background: rgba(255, 255, 255, 0.9);
}

.cursor-dot[data-invert='1'][data-state='hover'] {
  background: #fff;
}

.cursor-dot[data-invert='1'][data-state='text'] {
  background: #fff;
}

@media (prefers-reduced-motion: reduce) {
  .cursor-dot {
    transition: none;
  }
}
</style>
