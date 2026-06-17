import { onMounted, onBeforeUnmount, ref } from 'vue'
import Lenis from 'lenis'

/**
 * Lenis 阻尼滚动 composable
 * - 尊重 prefers-reduced-motion
 * - 自动 raf 循环
 * - 卸载时清理
 */
export function useSmoothScroll() {
  const lenis = ref(null)
  const enabled = ref(false)
  let rafId = null

  function init() {
    // 尊重无障碍偏好
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      enabled.value = false
      return
    }

    const instance = new Lenis({
      lerp: 0.1,           // 0~1，越小越平滑
      wheelMultiplier: 1,  // 滚轮速度
      touchMultiplier: 1.4,
      smoothWheel: true
    })

    function raf(time) {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    lenis.value = instance
    enabled.value = true
  }

  function destroy() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (lenis.value) {
      lenis.value.destroy()
      lenis.value = null
    }
    enabled.value = false
  }

  onMounted(init)
  onBeforeUnmount(destroy)

  return { lenis, enabled }
}
