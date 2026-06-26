<script setup>
import { computed, onMounted } from 'vue'
import gsap from 'gsap'
import MenuItem from './MenuItem.vue'
import SocialIcons from './SocialIcons.vue'

const props = defineProps({
  categories: { type: Array, required: true },
  activeCategory: { type: String, required: true },
  counts: { type: Object, required: true }
})

const emit = defineEmits(['select-category'])

function onLogoClick() {
  emit('select-category', 'all')
}

const mainCategories = props.categories.filter((c) => c.key !== 'all')

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
    <section class="side-menu__section" aria-labelledby="worksets">
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
        >
          <MenuItem
            :labelEN="cat.labelEN"
            :labelCN="cat.labelCN"
            :active="activeCategory === cat.key"
            @select="emit('select-category', cat.key)"
          />
        </li>
      </ul>
    </section>

    <!-- 分隔线 -->
    <hr class="side-menu__divider" aria-hidden="true" />

    <!-- 次要菜单 -->
    <section class="side-menu__section">
      <h2 class="side-menu__heading">
        <span
          v-for="(char, i) in infoHeadingChars"
          :key="'info-' + i"
          class="heading-char"
        >{{ char }}</span>
      </h2>
      <ul class="side-menu__list">
        <li class="menu-item-wrapper">
          <MenuItem
            labelEN="ABOUT ME&nbsp;&nbsp; | &nbsp;&nbsp;关于我"
            :active="activeCategory === 'about'"
            @select="emit('select-category', 'about')"
          />
        </li>
        <li class="menu-item-wrapper">
          <MenuItem
            labelEN="CONTACT&nbsp;&nbsp; | &nbsp;&nbsp;联系"
            :active="activeCategory === 'contact'"
            @select="emit('select-category', 'contact')"
          />
        </li>
        <li class="menu-item-wrapper">
          <MenuItem
            labelEN="GUESTBOOK&nbsp;&nbsp; | &nbsp;&nbsp;留言墙"
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
  display: flex;
  flex-direction: column;
  width: var(--side-width);
  min-width: 320px;
  max-width: 480px;
  height: 100vh;
  padding: var(--space-7) var(--space-6) var(--space-6);
  background: var(--c-bone);
  border-right: 1px solid var(--c-mist);
  overflow-y: auto;
  position: sticky;
  top: 0;
  align-self: start;
  font-family: var(--font-body);
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
}

.side-menu__logo-mark,
.side-menu__logo-text {
  display: block;
}

.logo-char {
  display: inline-block;
  will-change: transform, opacity;
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

.side-menu__divider {
  border: none;
  border-top: 1px solid var(--c-mist);
  margin: var(--space-4) 0 var(--space-4);
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
