<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, useSlots } from 'vue'
import PhotoCard from './PhotoCard.vue'

const props = defineProps({
  items: { type: Array, required: true },
  /** 列数断点（与 CSS 列宽对应） */
  breakpoints: {
    type: Object,
    default: () => ({ 0: 2, 700: 3, 1100: 4, 1500: 5 })
  },
  /** 列间距 px */
  gap: { type: Number, default: 4 }
})

const emit = defineEmits(['card-click', 'relayout'])

const gridEl = ref(null)
const positions = ref([]) // [{ left, top, width, height }, ...]
const containerHeight = ref(0)

// 如果父级传入了 default slot,就用 slot 渲染（保持定位由 MasonryGrid 提供）
// 否则降级为 PhotoCard（与历史用法一致）
const slots = useSlots()
const useSlot = !!slots.default

let ro = null
let winRO = null

function getColumnCount(width) {
  const bp = props.breakpoints
  const keys = Object.keys(bp)
    .map(Number)
    .sort((a, b) => a - b)
  let count = bp[0] ?? 1
  for (const k of keys) {
    if (width >= k) count = bp[k]
  }
  return count
}

function relayout() {
  const el = gridEl.value
  if (!el) return
  const containerWidth = el.clientWidth
  if (!containerWidth) return

  const columnCount = getColumnCount(containerWidth)
  const columnWidth = (containerWidth - (columnCount - 1) * props.gap) / columnCount

  const colHeights = new Array(columnCount).fill(0)
  const result = new Array(props.items.length)

  for (let i = 0; i < props.items.length; i++) {
    const item = props.items[i]
    const ratio = (item.height || 4) / (item.width || 5)
    const cardHeight = columnWidth * ratio

    // 选最矮的列
    let minIdx = 0
    for (let c = 1; c < columnCount; c++) {
      if (colHeights[c] < colHeights[minIdx]) minIdx = c
    }

    const left = minIdx * (columnWidth + props.gap)
    const top = colHeights[minIdx]

    result[i] = { left, top, width: columnWidth, height: cardHeight }
    colHeights[minIdx] = top + cardHeight + props.gap
  }

  positions.value = result
  // 容器高度 = 最高列高（去掉最后那个 gap）
  containerHeight.value = Math.max(0, Math.max(...colHeights) - props.gap)
  // 通知父组件（如 Lenis）刷新滚动边界
  emit('relayout')
}

onMounted(() => {
  relayout()
  // 容器尺寸变化（如侧栏收起、字体加载导致重排）
  if (typeof ResizeObserver !== 'undefined' && gridEl.value) {
    ro = new ResizeObserver(() => relayout())
    ro.observe(gridEl.value)
  }
  // 窗口缩放
  if (typeof ResizeObserver !== 'undefined') {
    winRO = new ResizeObserver(() => relayout())
    winRO.observe(document.documentElement)
  }
})

onBeforeUnmount(() => {
  ro?.disconnect()
  winRO?.disconnect()
})

// items / 列数变化时重排
watch(
  () => [props.items.length, props.gap, JSON.stringify(props.breakpoints)],
  () => nextTick(relayout)
)

function handleClick(index) {
  emit('card-click', index)
}
</script>

<template>
  <div ref="gridEl" class="masonry-grid" :style="{ height: containerHeight + 'px' }">
    <template v-if="!useSlot">
      <PhotoCard
        v-for="(item, idx) in items"
        v-show="positions[idx]"
        :key="item.id"
        :item="item"
        :index="idx"
        :style="{
          position: 'absolute',
          left: (positions[idx]?.left ?? 0) + 'px',
          top: (positions[idx]?.top ?? 0) + 'px',
          width: (positions[idx]?.width ?? 0) + 'px',
          height: (positions[idx]?.height ?? 0) + 'px'
        }"
        @click="handleClick(idx)"
      />
    </template>
    <template v-else>
      <div
        v-for="(item, idx) in items"
        v-show="positions[idx]"
        :key="item.id"
        class="masonry-grid__slot-item"
        :style="{
          position: 'absolute',
          left: (positions[idx]?.left ?? 0) + 'px',
          top: (positions[idx]?.top ?? 0) + 'px',
          width: (positions[idx]?.width ?? 0) + 'px',
          height: (positions[idx]?.height ?? 0) + 'px'
        }"
        @click="handleClick(idx)"
      >
        <slot :item="item" :index="idx" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.masonry-grid {
  position: relative;
  width: 100%;
}

.masonry-grid__slot-item {
  display: block;
}
</style>