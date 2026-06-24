<script setup>
import { ref, watch, onMounted } from 'vue'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import WaterfallCard from './WaterfallCard.vue'

const props = defineProps({
  items: { type: Array, required: true },
  /** 列数断点 */
  breakpoints: {
    type: Object,
    default: () => ({ 0: 2, 700: 3, 1100: 5, 1500: 5 })
  },
  /** 列间距 px */
  gap: { type: Number, default: 4 }
})

const emit = defineEmits(['card-click', 'relayout'])

const waterfallRef = ref(null)

// vue-waterfall-plugin-next v3 breakpoints format: { containerWidth: { rowPerView } }
const wfBreakpoints = ref({})

function buildBreakpoints() {
  const result = {}
  const keys = Object.keys(props.breakpoints)
    .map(Number)
    .sort((a, b) => a - b)
  for (const k of keys) {
    result[k] = { rowPerView: props.breakpoints[k] }
  }
  wfBreakpoints.value = result
}

onMounted(() => {
  buildBreakpoints()
  emit('relayout')
})

watch(
  () => [JSON.stringify(props.breakpoints), props.gap],
  () => buildBreakpoints()
)

function handleCardClick(index) {
  emit('card-click', index)
}

function handleAfterRender() {
  emit('relayout')
}

// 3D 拾起效果
const tiltData = ref({})
const hoveredId = ref(null)

function onMouseMove(e, itemId) {
  const rect = e.currentTarget.getBoundingClientRect()
  tiltData.value = {
    ...tiltData.value,
    [itemId]: {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5
    }
  }
}

function onMouseEnter(itemId) {
  hoveredId.value = itemId
}

function onMouseLeave(itemId) {
  hoveredId.value = null
  tiltData.value = { ...tiltData.value, [itemId]: { x: 0, y: 0 } }
}
</script>

<template>
  <Waterfall
    ref="waterfallRef"
    :list="items"
    :breakpoints="wfBreakpoints"
    :gutter="gap"
    :lazyload="true"
    :animation-delay="300"
    :animation-duration="800"
    :has-around-gutter="false"
    class="masonry-grid"
    @after-render="handleAfterRender"
  >
    <template #default="{ item, index }">
      <WaterfallCard
        :item="item"
        :index="index"
        :is-hovered="hoveredId === item.id"
        :tilt-x="(tiltData[item.id]?.y ?? 0) * 18 + 'deg'"
        :tilt-y="-((tiltData[item.id]?.x ?? 0) * 18) + 'deg'"
        @mouse-move="(e) => onMouseMove(e, item.id)"
        @mouse-enter="() => onMouseEnter(item.id)"
        @mouse-leave="() => onMouseLeave(item.id)"
        @click="handleCardClick(index)"
      />
    </template>
  </Waterfall>
</template>

<style scoped>
.masonry-grid {
  width: 100%;
}
</style>
