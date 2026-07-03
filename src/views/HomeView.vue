<script setup>
import { onMounted, ref } from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import MasonryGrid from '@/components/MasonryGrid.vue'
import Lightbox from '@/components/Lightbox.vue'
import AboutSection from '@/components/AboutSection.vue'
import GuestbookSection from '@/components/GuestbookSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import { usePhotos } from '@/composables/usePhotos.js'
import { useSmoothScroll } from '@/composables/useSmoothScroll.js'

const { categories, activeCategory, counts, masonryItems, setCategory } = usePhotos()
const { resize: notifyScroll } = useSmoothScroll()

const lightboxRef = ref(null)
const placeholderMessage = ref('')

/* —— 移动端抽屉状态 —— */
const drawerOpen = ref(false)

function handleSelectCategory(key) {
  placeholderMessage.value = ''
  setCategory(key)
  // 移动端选中分类后自动收起抽屉
  if (window.matchMedia('(max-width: 768px)').matches) {
    drawerOpen.value = false
  }
}

function handleCardClick(index) {
  lightboxRef.value?.openByIndex(index)
}

function openDrawer() {
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

/* 路由式分类切换（监听 ESC 关闭抽屉） */
function onKeydown(e) {
  if (e.key === 'Escape' && drawerOpen.value) closeDrawer()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="home" :class="{ 'drawer-is-open': drawerOpen }">
    <!-- 移动端：汉堡按钮 -->
    <button
      class="hamburger"
      type="button"
      :aria-expanded="drawerOpen"
      aria-label="打开导航"
      @click="openDrawer"
    >
      <span class="hamburger__bar"></span>
      <span class="hamburger__bar"></span>
      <span class="hamburger__bar"></span>
    </button>

    <!-- 移动端：抽屉遮罩 -->
    <div
      class="drawer-scrim"
      :class="{ 'is-open': drawerOpen }"
      aria-hidden="true"
      @click="closeDrawer"
    ></div>

    <SideMenu
      :categories="categories"
      :active-category="activeCategory"
      :counts="counts"
      :drawer-open="drawerOpen"
      @select-category="handleSelectCategory"
      @close-drawer="closeDrawer"
    />

    <main class="main-pane" role="main" @click="drawerOpen && closeDrawer()">
      <!-- 顶部：按 brief 严格无任何内容（无标题/搜索/筛选/面包屑） -->

      <AboutSection v-if="activeCategory === 'about'" />

      <ContactSection v-else-if="activeCategory === 'contact'" />

      <GuestbookSection v-else-if="activeCategory === 'guestbook'" />

      <MasonryGrid
        v-else-if="masonryItems.length"
        :key="activeCategory"
        :items="masonryItems"
        @card-click="handleCardClick"
        @relayout="notifyScroll"
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
  min-height: 100dvh;
  background: var(--c-bone);
  transition: filter 0.25s ease;
}

.main-pane {
  position: relative;
  padding: var(--space-4);
  min-width: 0;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  min-height: 60dvh;
}

.empty__text {
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  color: var(--c-mid);
}

/* —— 汉堡按钮 —— 默认隐藏，移动端显示 —— */
.hamburger {
  display: none;
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 200;
  width: 40px;
  height: 40px;
  border: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 4px;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: background 0.2s ease;
}

.hamburger:hover {
  background: rgba(255, 255, 255, 1);
}

.hamburger__bar {
  display: block;
  width: 18px;
  height: 1.5px;
  background: var(--c-ink);
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.drawer-is-open .hamburger__bar:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}
.drawer-is-open .hamburger__bar:nth-child(2) {
  opacity: 0;
}
.drawer-is-open .hamburger__bar:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* —— 抽屉遮罩 —— */
.drawer-scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  z-index: 90;
  transition: background 0.28s ease;
}

.drawer-scrim.is-open {
  background: rgba(0, 0, 0, 0.42);
  pointer-events: auto;
}

/* —— 移动端布局 —— */
@media (max-width: 768px) {
  .home {
    grid-template-columns: 1fr;
    min-width: 0;
  }

  .hamburger {
    display: flex;
  }

  .drawer-is-open .main-pane {
    pointer-events: none;
    user-select: none;
  }

  .main-pane {
    padding: var(--space-4);
    /* 给顶部留出汉堡按钮不挡住内容的安全距离 */
    padding-top: 72px;
  }
}

/* 极小屏再压缩 */
@media (max-width: 480px) {
  .main-pane {
    padding: 64px var(--space-3) var(--space-3);
  }
}
</style>
