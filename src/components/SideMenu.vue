<script setup>
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'
import MenuItem from './MenuItem.vue'
import SocialIcons from './SocialIcons.vue'

const props = defineProps({
  categories: { type: Array, required: true },
  activeCategory: { type: String, required: true },
  counts: { type: Object, required: true }
})

const emit = defineEmits(['select-category'])

const menuSectionRef = ref(null)
const hoverBarRef = ref(null)

function onLogoClick() {
  emit('select-category', 'all')
}

const mainCategories = props.categories.filter((c) => c.key !== 'all')

// Handle hover on menu item
function onMenuHover(event) {
  if (!menuSectionRef.value || !hoverBarRef.value) return

  const wrapper = event.currentTarget
  const menuItem = wrapper.querySelector('.menu-item')
  if (!menuItem) return

  const sectionRect = menuSectionRef.value.getBoundingClientRect()
  const itemRect = menuItem.getBoundingClientRect()

  // Calculate center position relative to section
  const targetY = itemRect.top - sectionRect.top + itemRect.height / 2

  gsap.to(hoverBarRef.value, {
    top: targetY,
    opacity: 1,
    duration: 0.35,
    ease: 'power2.out'
  })
}

function onSectionLeave() {
  if (!hoverBarRef.value) return
  gsap.to(hoverBarRef.value, {
    opacity: 0,
    duration: 0.2
  })
}

// Split text to chars helper
function splitToChars(text) {
  return text.split('')
}

// Section headings
const worksHeadingChars = computed(() => splitToChars('MY WORKS 我的作品'))
const infoHeadingChars = computed(() => splitToChars('INFO 更多'))

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Logo animation
  tl.from('.logo-char--mark', {
    y: 40,
    opacity: 0,
    rotationX: -90,
    duration: 0.6,
    stagger: 0.03
  })
  .from('.logo-char--text', {
    y: 25,
    opacity: 0,
    duration: 0.5,
    stagger: 0.02
  }, '-=0.3')

  // Section headings animation
  .from('.heading-char', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.015
  }, '-=0.2')

  // Menu items animation
  .from('.menu-item-wrapper', {
    x: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out'
  }, '-=0.3')

  // Divider animation
  .from('.side-menu__divider', {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.5,
    ease: 'power2.inOut'
  }, '-=0.1')

  // Social icons animation
  .from('.social-icons', {
    opacity: 0,
    y: 10,
    duration: 0.4
  }, '-=0.2')
})
</script>

<template>
  <aside class="side-menu" aria-label="主导航">
    <!-- Logo / 个人标识 -->
    <button class="side-menu__logo" type="button" @click="onLogoClick" aria-label="回到首页">
      <span class="side-menu__logo-mark">
        <span
          v-for="(char, i) in splitToChars('Mr.VK')"
          :key="'logo-mark-' + i"
          class="logo-char logo-char--mark"
        >{{ char }}</span>
      </span>
      <span class="side-menu__logo-text">
        <span
          v-for="(char, i) in splitToChars('Leo Liang')"
          :key="'logo-text-' + i"
          class="logo-char logo-char--text"
        >{{ char }}</span>
      </span>
    </button>

    <!-- 作品集主菜单 -->
    <section
      ref="menuSectionRef"
      class="side-menu__section"
      aria-labelledby="worksets"
      @mouseleave="onSectionLeave"
    >
      <!-- 共享的悬浮 Bar -->
      <span ref="hoverBarRef" class="hover-bar" aria-hidden="true"></span>

      <h2 id="worksets" class="side-menu__heading">
        <span
          v-for="(char, i) in worksHeadingChars"
          :key="'works-' + i"
          class="heading-char"
        >{{ char }}</span>
      </h2>
      <ul class="side-menu__list">
        <li
          v-for="cat in mainCategories"
          :key="cat.key"
          class="menu-item-wrapper"
          @mouseenter="onMenuHover"
        >
          <MenuItem
            :labelEN="cat.labelEN"
            :labelCN="cat.labelCN"
            :active="activeCategory === cat.key"
            @select="emit('select-category', cat.key)"
          />
        </li>
      </ul>

      <!-- 分隔线 -->
      <hr class="side-menu__divider" aria-hidden="true" />

      <!-- 次要菜单 -->
      <ul class="side-menu__list side-menu__list--secondary">
        <li class="menu-item-wrapper" @mouseenter="onMenuHover">
          <MenuItem
            labelEN="About Me"
            labelCN="关于我"
            :active="activeCategory === 'about'"
            @select="emit('select-category', 'about')"
          />
        </li>
        <li class="menu-item-wrapper" @mouseenter="onMenuHover">
          <MenuItem
            labelEN="Contact"
            labelCN="联系"
            :active="activeCategory === 'contact'"
            @select="emit('select-category', 'contact')"
          />
        </li>
        <li class="menu-item-wrapper" @mouseenter="onMenuHover">
          <MenuItem
            labelEN="Guestbook"
            labelCN="留言墙"
            :active="activeCategory === 'guestbook'"
            @select="emit('select-category', 'guestbook')"
          />
        </li>
      </ul>
    </section>

    <div class="side-menu__spacer"></div>

    <!-- 社交图标 -->
    <div class="social-icons">
      <SocialIcons :size="18" />
    </div>
  </aside>
</template>

<style scoped>
.side-menu {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: var(--side-width);
  min-width: 296px;
  max-width: 480px;
  height: 100vh;
  padding: var(--space-7) var(--space-6) var(--space-6);
  background: var(--c-bone);
  overflow-y: auto;
  align-self: start;
  font-family: var(--font-body);
  /*
   * 右侧层次阴影 —— 让侧栏从主内容区轻微抬起（克制 / 无截断感版）。
   *
   * 关键：去掉 1px 描边层（硬边界制造"截断"），让所有阴影都从源头 0px 起始，
   * 即阴影只在 offset 方向上扩散，不在侧栏边缘形成可见的硬线。
   * 多层模糊叠加，靠远端柔光晕建立层级感，眼睛感知不到具体边界。
   * 色相与 oklch(55.2% .016 285.938) 中性灰调和谐。
   */
  box-shadow:
    0 0 6px oklch(20% 0.012 285.938 / 0.025),
    0 0 14px oklch(20% 0.012 285.938 / 0.035),
    0 0 32px oklch(20% 0.012 285.938 / 0.045);
}

.side-menu__logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-bottom: var(--space-7);
  text-align: left;
  cursor: pointer;
  perspective: 500px;
  padding-left: 12px;
}

.side-menu__logo-mark,
.side-menu__logo-text {
  display: block;
}

.logo-char {
  display: inline-block;
  will-change: transform, opacity;
}

.logo-char--text {
  min-width: 0.3em;
}

.logo-char--text:empty {
  min-width: 0;
}

.side-menu__logo-mark {
  font-family: var(--font-artier);
  font-size: 40px;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--c-ink);
}

.side-menu__logo-text {
  font-family: var(--font-hans);
  font-size: var(--fs-base);
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--c-mid);
}

.side-menu__section {
  position: relative;
  margin-bottom: var(--space-5);
}

.side-menu__heading {
  display: flex;
  flex-wrap: wrap;
  font-family: var(--font-hans);
  font-size: var(--fs-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--c-mid);
  margin: 0 0 var(--space-2) 16px;
}

.heading-char {
  display: inline-block;
  will-change: transform, opacity;
}

.side-menu__list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item-wrapper {
  will-change: transform, opacity;
}

.side-menu__list--secondary :deep(.menu-item__label-en)::after {
  content: '|';
  display: inline-block;
  margin-left: 8px;
  color: var(--c-ink);
  font-weight: 300;
  transform: scaleY(0.8);
  transform-origin: center;
}

.side-menu__divider {
  border: none;
  border-top: 1px solid var(--c-mist);
  margin: var(--space-4) 0 var(--space-4);
}

.hover-bar {
  position: absolute;
  left: 0;
  width: 2px;
  height: 14px;
  background: var(--c-mid);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  transform: translateY(-50%);
}

.side-menu__spacer {
  flex: 1;
  min-height: var(--space-6);
}

/* 自定义滚动条（极简） */
.side-menu::-webkit-scrollbar {
  width: 4px;
}
.side-menu::-webkit-scrollbar-thumb {
  background: var(--c-mist);
}
</style>
