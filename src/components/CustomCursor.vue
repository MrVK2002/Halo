<script setup>
/**
 * CustomCursor —— 替代系统光标
 *  - 跟随鼠标的「点」（高响应）
 *  - 跟随鼠标的「环」（带 lerp 缓动）
 *  - 进入可点击元素时放大环；进入输入框时缩小
 *  - 离开窗口 / 滚动 / reduced-motion / touch 设备时自动隐藏并放行原生光标
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const enabled = ref(false)
const dotRef = ref(null)
const ringRef = ref(null)

let rafId = 0
let pending = null
const target = { x: 0, y: 0 }
const ring = { x: 0, y: 0 }
const dot = { x: 0, y: 0 }
let hovering = false
let pressing = false
let visible = true

const INTERACTIVE = 'a,button,[role="button"],input,textarea,select,label,summary,.menu-item,[data-cursor="pointer"]'
const TEXT_INPUT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]),textarea,[contenteditable="true"]'

function computeRingScale() {
  if (!visible) return 0
  if (pressing) return 0.7
  return hovering ? 2.2 : 1
}

function tick() {
  if (!enabled.value) return
  ring.x += (target.x - ring.x) * 0.18
  ring.y += (target.y - ring.y) * 0.18
  dot.x += (target.x - dot.x) * 0.9
  dot.y += (target.y - dot.y) * 0.9
  if (dotRef.value) {
    const dotScale = pressing ? 'scale(0.5)' : ''
    dotRef.value.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) ${dotScale}`
  }
  if (ringRef.value) {
    const scale = computeRingScale()
    ringRef.value.style.transform =
      `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale})`
    ringRef.value.style.opacity = visible ? '1' : '0'
  }
  rafId = requestAnimationFrame(tick)
}

function detectHoverAt(x, y) {
  const el = document.elementFromPoint(x, y)
  if (!el) return
  hovering = false
  if (el.closest(TEXT_INPUT)) {
    hovering = 'text'
    return
  }
  if (el.closest(INTERACTIVE) || el.closest('a')) {
    hovering = true
  }
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
      ref="ringRef"
      class="cursor-ring"
      :data-state="hovering === 'text' ? 'text' : hovering ? 'hover' : 'idle'"
    />
    <div ref="dotRef" class="cursor-dot" />
  </div>
</template>

<style scoped>
.cursor-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  contain: layout paint;
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  margin: 0;
  background: var(--c-ink, #111);
  border-radius: 50%;
  will-change: transform;
  transition: width 0.18s ease, height 0.18s ease, background 0.18s ease;
}

.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  margin: 0;
  border: 1.5px solid var(--c-ink, #111);
  border-radius: 50%;
  will-change: transform, width, height, border-color;
  transition:
    width 0.22s cubic-bezier(0.2, 0.7, 0.2, 1),
    height 0.22s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.18s ease,
    background-color 0.18s ease,
    opacity 0.18s ease;
}

.cursor-ring[data-state='hover'] {
  width: 48px;
  height: 48px;
  border-color: var(--c-ink, #111);
  background: oklch(20% 0.012 285.938 / 0.04);
}

.cursor-ring[data-state='text'] {
  width: 2px;
  height: 22px;
  border-radius: 1px;
  border-color: var(--c-ink, #111);
}

@media (prefers-reduced-motion: reduce) {
  .cursor-dot,
  .cursor-ring {
    transition: none;
  }
}
</style>
