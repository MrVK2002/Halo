<script setup>
import { ref, watch } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MasonryGrid from '@/components/MasonryGrid.vue'
import Lightbox from '@/components/Lightbox.vue'
import { usePhotos } from '@/composables/usePhotos.js'
import { useSmoothScroll } from '@/composables/useSmoothScroll.js'

const { categories, activeCategory, counts, masonryItems, setCategory } = usePhotos()
useSmoothScroll()

const lightboxRef = ref(null)
const placeholderMessage = ref('')

function handleSelectCategory(key) {
  placeholderMessage.value = ''
  if (key === 'about' || key === 'contact' || key === 'guestbook') {
    const map = {
      about: '关于摄影师页面正在筹备中。',
      contact: '联系 / 约拍入口即将开放。',
      guestbook: '留言墙模块将在下一版本上线。'
    }
    placeholderMessage.value = map[key]
    setCategory('all')
    return
  }
  setCategory(key)
}

function handleCardClick(index) {
  lightboxRef.value?.openByIndex(index)
}
</script>

<template>
  <div class="home">
    <SideMenu
      :categories="categories"
      :active-category="activeCategory"
      :counts="counts"
      @select-category="handleSelectCategory"
    />

    <main class="main-pane" role="main">
      <!-- 顶部：按 brief 严格无任何内容（无标题/搜索/筛选/面包屑） -->

      <MasonryGrid
        v-if="masonryItems.length"
        :key="activeCategory"
        :items="masonryItems"
        @card-click="handleCardClick"
      />

      <div v-else class="empty">
        <p class="empty__text">{{ placeholderMessage || '该分类暂无作品。' }}</p>
      </div>
    </main>

    <Lightbox ref="lightboxRef" :items="masonryItems" />
  </div>
</template>

<style scoped>
.home {
  display: grid;
  grid-template-columns: var(--side-width) var(--main-width);
  min-width: var(--layout-min-width);
  min-height: 100vh;
  background: var(--c-bone);
}

.main-pane {
  position: relative;
  padding: var(--space-5);
  min-width: 0;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.empty__text {
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  color: var(--c-mid);
}
</style>
