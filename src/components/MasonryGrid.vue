<script setup>
import PhotoCard from './PhotoCard.vue'

const props = defineProps({
  items: { type: Array, required: true }
})

const emit = defineEmits(['card-click'])

function handleClick(index) {
  emit('card-click', index)
}
</script>

<template>
  <div class="masonry-grid">
    <PhotoCard
      v-for="(item, idx) in items"
      :key="item.id"
      :item="item"
      :index="idx"
      @click="handleClick(idx)"
    />
  </div>
</template>

<style scoped>
/*
 * CSS 多列瀑布流：每列独立垂直流动，按图片原始宽高比自然错落。
 * 列数随主面板宽度自动变化（容器宽度 ≈ 280px 时新增一列）。
 */
.masonry-grid {
  width: 100%;
  column-count: 2;
  column-gap: 16px;
}

@media (min-width: 700px) {
  .masonry-grid {
    column-count: 3;
  }
}

@media (min-width: 1100px) {
  .masonry-grid {
    column-count: 4;
  }
}

@media (min-width: 1500px) {
  .masonry-grid {
    column-count: 5;
  }
}

:deep(.photo-card) {
  display: inline-block; /* 列布局需要 inline-block 容器 */
  width: 100%;
  margin: 0 0 16px;
  /* 防止卡片在列中间被截断 */
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
}
</style>