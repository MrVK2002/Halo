<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import WaterfallCard from './WaterfallCard.vue'

// 防止动画期间页面跳动
let scrollY = 0
let scrollLocked = false

const props = defineProps({
  items: { type: Array, required: true },
  /** 列数断点。默认：极小屏单列/小屏双列/中屏三列/大屏五列 */
  breakpoints: {
    type: Object,
    default: () => ({ 0: 1, 480: 2, 700: 3, 1100: 4, 1500: 5 })
  },
  /** 列间距 px */
  gap: { type: Number, default: 12 },
  /** 触屏设备列间距（默认更小以容纳更多视觉密度） */
  touchGap: { type: Number, default: 6 },
  /** GSAP 动画缓动 */
  ease: { type: String, default: 'power3.out' },
  /** 入场动画时长 */
  duration: { type: Number, default: 0.6 },
  /** 交错延迟 */
  stagger: { type: Number, default: 0.05 },
  /** 入场方向 */
  animateFrom: { type: String, default: 'bottom' },
  /** 悬停缩放 */
  hoverScale: { type: Number, default: 0.95 },
  /** 触屏设备缩放（更小，更不会触发抖动） */
  touchHoverScale: { type: Number, default: 0.97 }
})

const emit = defineEmits(['card-click', 'relayout'])

const containerRef = ref(null)
const containerWidth = ref(0)
const hasMounted = ref(false)

/* 触屏判定（用于调整瀑布流间距 + hover 行为） */
const isTouch =
  typeof window !== 'undefined' &&
  (('ontouchstart' in window) ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0)

/* 当前生效的列间距：触屏更小 */
const effectiveGap = computed(() => (isTouch ? props.touchGap : props.gap))

/* 当前生效的 hover 缩放：触屏使用更小档位 */
const effectiveHoverScale = computed(() => (isTouch ? props.touchHoverScale : props.hoverScale))

// 3D tilt 效果
const tiltData = ref({})
const hoveredId = ref(null)

// 计算列数
const columns = computed(() => {
  const width = containerWidth.value
  const sorted = Object.entries(props.breakpoints)
    .map(([k, v]) => [Number(k), v])
    .sort((a, b) => a[0] - b[0])

  let cols = sorted[0]?.[1] ?? 2
  for (const [minWidth, colCount] of sorted) {
    if (width >= minWidth) {
      cols = colCount
    }
  }
  return cols
})

// 计算瀑布流位置
const grid = computed(() => {
  if (!containerWidth.value || !props.items.length) return []

  const colHeights = new Array(columns.value).fill(0)
  const columnWidth = (containerWidth.value - effectiveGap.value * (columns.value - 1)) / columns.value

  return props.items.map((item) => {
    const col = colHeights.indexOf(Math.min(...colHeights))
    const x = col * (columnWidth + effectiveGap.value)
    const height = columnWidth * ((item.height || 4) / (item.width || 3))
    const y = colHeights[col]

    colHeights[col] += height + effectiveGap.value

    return {
      ...item,
      x,
      y,
      width: columnWidth,
      height
    }
  })
})

// 获取容器高度
const containerHeight = computed(() => {
  if (!grid.value.length) return 0
  return Math.max(...grid.value.map(item => item.y + item.height))
})

// 监听尺寸变化
let resizeObserver = null

function updateWidth() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

onMounted(() => {
  updateWidth()
  resizeObserver = new ResizeObserver(() => {
    updateWidth()
    emit('relayout')
  })
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
  window.addEventListener('scroll', lockScroll, { passive: true })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', lockScroll)
  document.body.style.overflow = ''
})

function lockScroll() {
  if (scrollLocked) {
    window.scrollTo(0, scrollY)
  }
}

// 入场动画
function getInitialPosition(item) {
  const direction = props.animateFrom === 'random'
    ? ['top', 'bottom', 'left', 'right'][Math.floor(Math.random() * 4)]
    : props.animateFrom

  switch (direction) {
    case 'top': return { x: item.x, y: -200 }
    case 'bottom': return { x: item.x, y: window.innerHeight + 200 }
    case 'left': return { x: -200, y: item.y }
    case 'right': return { x: window.innerWidth + 200, y: item.y }
    default: return { x: item.x, y: item.y + 100 }
  }
}

// 动画执行
function animateItems() {
  nextTick(() => {
    // 首次入场时锁定滚动位置
    if (!hasMounted.value) {
      scrollY = window.scrollY
      scrollLocked = true
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, scrollY)
    }

    grid.value.forEach((item, index) => {
      const el = containerRef.value?.querySelector(`[data-key="${item.id}"]`)
      if (!el) return

      if (hasMounted.value) {
        gsap.to(el, {
          x: item.x,
          y: item.y,
          duration: props.duration,
          ease: props.ease,
          overwrite: 'auto'
        })
      } else {
        const initial = getInitialPosition(item)
        gsap.fromTo(el,
          {
            opacity: 0,
            x: initial.x,
            y: initial.y,
            scale: 0.9,
            filter: 'blur(8px)'
          },
          {
            opacity: 1,
            x: item.x,
            y: item.y,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: props.ease,
            delay: index * props.stagger,
            onComplete: () => {
              if (index === grid.value.length - 1) {
                scrollLocked = false
                document.body.style.overflow = ''
              }
            }
          }
        )
      }
    })

    hasMounted.value = true
  })
}

watch(() => props.items, animateItems, { deep: true })
watch(containerWidth, animateItems)

// 悬停效果
function handleMouseEnter(itemId) {
  if (isTouch) return // 触屏不触发 3D 倾斜
  hoveredId.value = itemId
  const el = containerRef.value?.querySelector(`[data-key="${itemId}"]`)
  if (el) {
    gsap.to(el, {
      scale: effectiveHoverScale.value,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

function handleMouseLeave(itemId) {
  if (isTouch) return
  hoveredId.value = null
  const el = containerRef.value?.querySelector(`[data-key="${itemId}"]`)
  if (el) {
    gsap.to(el, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

function handleMouseMove(e, itemId) {
  if (isTouch) return // 触屏不读坐标
  const el = containerRef.value?.querySelector(`[data-key="${itemId}"]`)
  if (el) {
    const rect = el.getBoundingClientRect()
    tiltData.value = {
      ...tiltData.value,
      [itemId]: {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5
      }
    }
  }
}

function handleCardClick(index) {
  emit('card-click', index)
}
</script>

<template>
  <div
    ref="containerRef"
    class="masonry-grid"
    :style="{ height: containerHeight + 'px' }"
  >
    <div
      v-for="(item, idx) in grid"
      :key="item.id"
      :data-key="item.id"
      class="masonry-item"
      :style="{
        position: 'absolute',
        width: item.width + 'px',
        height: item.height + 'px'
      }"
    >
      <WaterfallCard
        :item="item"
        :is-hovered="hoveredId === item.id"
        :tilt-x="((tiltData[item.id]?.y ?? 0) * 18) + 'deg'"
        :tilt-y="(-((tiltData[item.id]?.x ?? 0) * 18)) + 'deg'"
        @mouse-move="(e) => handleMouseMove(e, item.id)"
        @mouse-enter="() => handleMouseEnter(item.id)"
        @mouse-leave="() => handleMouseLeave(item.id)"
        @click="handleCardClick(idx)"
      />
    </div>
  </div>
</template>

<style scoped>
.masonry-grid {
  position: relative;
  width: 100%;
}

.masonry-item {
  will-change: transform, opacity;
  cursor: pointer;
}
</style>
