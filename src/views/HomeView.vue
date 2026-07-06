<script setup>
import { onMounted, ref, computed } from 'vue'
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

/* —— 移动端顶部右侧“作品集名称”标记 —— */
const mobileBrand = computed(() => {
  if (activeCategory.value === 'all') {
    return { mark: 'Mr.VK.', sub: 'Leo Liang Photography', layout: 'row' }
  }
  const cat = categories.find((c) => c.key === activeCategory.value)
  if (!cat) return { mark: 'Mr.VK.', sub: 'Leo Liang Photography', layout: 'row' }
  return {
    brand: 'Mr.VK.',
    mark: cat.labelEN || '',
    sub: cat.labelCN || '',
    layout: 'tall'
  }
})

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
    <!-- 移动端：统一顶部条（汉堡 + 作品集名称） -->
    <header v-show="!drawerOpen" class="mobile-topbar">
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

      <!-- 移动端：作品集名称 / 品牌行 -->
      <div
        class="mobile-brand"
        :class="{
          'is-tall': mobileBrand.layout === 'tall',
          'is-row': mobileBrand.layout === 'row'
        }"
        aria-hidden="true"
      >
        <!-- 横向单行：首页品牌行 [Mr.VK | Leo Liang Photography] -->
        <template v-if="mobileBrand.layout === 'row'">
          <span class="mobile-brand__mark mobile-brand__mark--row">{{ mobileBrand.mark }}</span>
          <span class="mobile-brand__sub mobile-brand__sub--row">{{ mobileBrand.sub }}</span>
        </template>
        <!-- 双行：Mr.VK.（大 logo）+ 分割线 + EN/CN 叠两行 -->
        <template v-else>
          <div class="mobile-brand__layout">
            <span class="mobile-brand__brand">{{ mobileBrand.brand }}</span>
            <span class="mobile-brand__sep" aria-hidden="true"></span>
            <div class="mobile-brand__stack">
              <span class="mobile-brand__mark">{{ mobileBrand.mark }}</span>
              <span v-if="mobileBrand.sub" class="mobile-brand__sub">{{ mobileBrand.sub }}</span>
            </div>
          </div>
        </template>
      </div>
    </header>

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

/* —— 移动端顶部条（汉堡 + 作品集名称 同一块） —— */
.mobile-topbar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  min-height: 48px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.28s ease, opacity 0.22s ease;
}

/* 抽屉打开 → 让位给抽屉（不要与抽屉的 ✕ 按钮重叠） */
.drawer-is-open .mobile-topbar {
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
  visibility: hidden;
  transition: transform 0.28s ease, opacity 0.22s ease, visibility 0s linear 0.28s;
}

/* —— 汉堡按钮 —— 默认隐藏，移动端显示 —— */
.hamburger {
  display: flex;
  position: relative;
  width: 40px;
  align-self: stretch;
  min-height: inherit;
  border: 0;
  background: transparent;
  padding: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.hamburger:hover {
  background: rgba(0, 0, 0, 0.04);
}

.hamburger__bar {
  display: block;
  width: 18px;
  height: 1.5px;
  background: var(--c-ink);
  transition: transform 0.25s ease, opacity 0.2s ease;
}

/* X 形闭合：用 50% 自适应任意按钮高度 */
.drawer-is-open .hamburger__bar:nth-child(1) {
  transform: translateY(calc(50% - 0.75px)) rotate(45deg);
}
.drawer-is-open .hamburger__bar:nth-child(2) {
  opacity: 0;
}
.drawer-is-open .hamburger__bar:nth-child(3) {
  transform: translateY(calc(-50% + 0.75px)) rotate(-45deg);
}

/* —— 移动端右上作品集名 —— */
.mobile-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 14px 0 12px;
  margin-left: 0;
  min-width: 0;
  font-family: var(--font-artier);
  color: var(--c-ink);
  line-height: 1.1;
  pointer-events: none;
  white-space: nowrap;
}

.mobile-brand__mark {
  font-size: 22px;
  letter-spacing: 0.02em;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-brand.is-tall {
  padding-top: 8px;
  padding-bottom: 8px;
}

.mobile-brand.is-row {
  flex-direction: row;
  align-items: baseline;
  justify-content: flex-start;
  padding: 0 14px 0 12px;
}

.mobile-brand.is-tall .mobile-brand__mark {
  font-size: 14px;
  font-family: var(--font-hans);
  font-weight: 500;
  margin-bottom: 1px;
  max-width: none;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
}

/* —— 作品集双层布局：Mr.VK.(logo) + EN/CN 叠行 —— */
.mobile-brand__layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.mobile-brand__stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

/* —— 品牌前缀 logo：Mr.VK. —— */
.mobile-brand__brand {
  display: inline-block;
  font-size: 26px;
  font-family: var(--font-artier);
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--c-ink);
  line-height: 1;
  /* 大写字母视觉中线比几何中线偏高，微调下移让字符中心对齐 stack 中线 */
  transform: translateY(2px);
}

/* —— 横向单行品牌行：[Mr.VK | Leo Liang Photography] —— */
.mobile-brand__mark--row {
  font-size: 24px;
  font-family: var(--font-artier);
  font-weight: 500;
  max-width: none;
  margin-right: 10px;
}

.mobile-brand__sub--row {
  display: inline-block;
  font-family: var(--font-hans);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--c-mid);
}

.mobile-brand__sub {
  display: block;
  font-family: var(--font-hans);
  font-weight: 400;
  font-size: 10px;
  color: var(--c-mid);
  letter-spacing: 0.04em;
}

/* —— 作品集名块内的竖分隔线 —— */
.mobile-brand__sep {
  display: inline-block;
  position: relative;
  width: 6px;
  height: 22px;
  flex-shrink: 0;
  align-self: center;
}

.mobile-brand__sep::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: 22px;
  background: var(--c-mist);
  transform: translate(-50%, -50%);
  transform-origin: center center;
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

  .mobile-topbar {
    display: flex;
    align-items: center;
  }

  .drawer-is-open .main-pane {
    pointer-events: none;
    user-select: none;
  }

  .main-pane {
    padding: 64px var(--space-4) var(--space-4);
    /* 给顶部条（48 + 16 呼吸）留出安全距离 */
  }
}

/* 极小屏再压缩 */
@media (max-width: 480px) {
  .main-pane {
    padding: 64px var(--space-3) var(--space-3);
  }
}
</style>
