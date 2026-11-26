<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import WaterfallCard from './WaterfallCard.vue'

// 防止动画期间页面跳动
let scrollY = 0
let scrollLocked = false

const props = defineProps({
  items: { type: Array, required: true },
  /** 是否还有下一批待加载（由 usePhotos 的分页状态驱动） */
  hasMore: { type: Boolean, default: false },
/**
 * 列数断点（按容器宽度自适应）
 * 移动端双列，随后随可用宽度逐级增加，2K 及以上六列
 * （与 SideMenu 的 (max-width: 768px) / CustomCursor 的 (hover: hover) 桌面判定对齐）
 */
breakpoints: {
  type: Object,
  default: () => ({ 0: 2, 620: 3, 900: 4, 1250: 5, 1900: 6 })
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

const emit = defineEmits(['card-click', 'relayout', 'load-more'])

const containerRef = ref(null)
const containerWidth = ref(0)
const hasMounted = ref(false)

/** 是否正在播放入场动画：动画期间隐藏底部提示，避免照片从文字上方划入 */
const isAnimating = ref(false)
/** 入场动画结束后的提示显隐计时器 */
let animationTimer = 0

/** 已参与过入场动画的 item id，用于区分新增批次与已有卡片 */
const renderedIds = new Set()
/** 距离底部多少像素开始加载下一批 */
const LOAD_THRESHOLD = 480
/** 防止同一批重复触发 */
let loadPending = false

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

/** 用户是否已经滚动过：避免首屏未滚动就被判定为“接近底部” */
let userHasScrolled = false

/**
 * 接近底部检测
 * - 仅在 hasMore 为 true 且没有待处理的加载时触发
 * - 如果页面本身无法滚动（内容不足一屏），允许直接补加载，避免卡住
 */
function checkNearBottom() {
  if (!props.hasMore || loadPending) return
  const el = containerRef.value
  if (!el) return

  const pageCanScroll =
    document.documentElement.scrollHeight > window.innerHeight + 1
  if (!userHasScrolled && pageCanScroll) return

  const distance = el.getBoundingClientRect().bottom - window.innerHeight
  if (distance <= LOAD_THRESHOLD) {
    loadPending = true
    emit('load-more')
  }
}

let scrollRaf = 0
function onWindowScroll() {
  userHasScrolled = true
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    checkNearBottom()
  })
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
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', lockScroll)
  window.removeEventListener('scroll', onWindowScroll)
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  clearTimeout(animationTimer)
  scrollLocked = false
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
    // 首批入场时锁定滚动位置，避免飞入动画引起页面跳动
    const isFirstBatch = !hasMounted.value
    if (isFirstBatch) {
      scrollY = window.scrollY
      scrollLocked = true
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, scrollY)
    }

    /** 本批次新增（尚未播放过入场动画）的卡片 */
    const fresh = []

    grid.value.forEach((item) => {
      const el = containerRef.value?.querySelector(`[data-key="${item.id}"]`)
      if (!el) return

      if (renderedIds.has(item.id)) {
        // 已有卡片：只跟随重排平滑移动
        gsap.to(el, {
          x: item.x,
          y: item.y,
          duration: props.duration,
          ease: props.ease,
          overwrite: 'auto'
        })
        return
      }

      renderedIds.add(item.id)
      fresh.push({ el, item })
    })

    // 本批次动画期间隐藏“已加载全部作品”，等卡片全部落位后再显示
    if (fresh.length) {
      clearTimeout(animationTimer)
      isAnimating.value = true
      const maxDelay = Math.min(fresh.length - 1, 10) * props.stagger
      const animationDuration = isFirstBatch ? 0.8 : 0.6
      animationTimer = window.setTimeout(() => {
        isAnimating.value = false
      }, (maxDelay + animationDuration) * 1000 + 200)
    }

    fresh.forEach(({ el, item }, index) => {
      const from = isFirstBatch
        ? {
            ...getInitialPosition(item),
            opacity: 0,
            scale: 0.9,
            filter: 'blur(8px)'
          }
        : {
            // 后续批次：从下方轻微浮入，与首屏动画区分
            x: item.x,
            y: item.y + 60,
            opacity: 0,
            scale: 0.96
          }

      gsap.fromTo(el, from, {
        x: item.x,
        y: item.y,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: isFirstBatch ? 0.8 : 0.6,
        ease: props.ease,
        delay: Math.min(index, 10) * props.stagger,
        onComplete: () => {
          // 首批最后一张完成后解除滚动锁
          if (isFirstBatch && index === fresh.length - 1) {
            scrollLocked = false
            document.body.style.overflow = ''
          }
        }
      })
    })

    hasMounted.value = true
  })
}

watch(() => props.items, animateItems, { deep: true })
watch(containerWidth, animateItems)

/** 新一批数据渲染后解除节流，并在仍接近底部时继续加载 */
watch(
  () => props.items.length,
  () => {
    loadPending = false
    nextTick(checkNearBottom)
  }
)

/** 已无更多数据时清理挂起的加载标记 */
watch(
  () => props.hasMore,
  (more) => {
    if (!more) loadPending = false
  }
)

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
  // 记录被点击卡片在视口中的位置，供灯箱做「拾起放大」过渡
  const item = props.items[index]
  const el = item ? containerRef.value?.querySelector(`[data-key="${item.id}"]`) : null
  emit('card-click', index, el ? el.getBoundingClientRect() : null, el)
}
</script>

<template>
  <div class="masonry">
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

    <!-- 全部加载完成提示：等最后一批卡片入场动画结束后再显示 -->
    <p v-if="!hasMore && containerHeight > 0 && !isAnimating" class="masonry-end" role="status">
      已加载全部作品
    </p>
  </div>
</template>

<style scoped>
.masonry {
  width: 100%;
}

.masonry-grid {
  position: relative;
  width: 100%;
}

.masonry-item {
  will-change: transform, opacity;
  cursor: pointer;
}

.masonry-end {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 44px 0 12px;
  /* 与侧边菜单保持一致的中文无衬线字体 */
  font-family: var(--font-hans);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-mid);
  /* 动画结束后出现：淡入上浮，避免突然弹出 */
  animation: masonry-end-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes masonry-end-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.masonry-end::before,
.masonry-end::after {
  content: '';
  width: 44px;
  height: 1px;
  background: var(--c-mist);
}
</style>
