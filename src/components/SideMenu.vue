<script setup>
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
</script>

<template>
  <aside class="side-menu" aria-label="主导航">
    <!-- Logo / 个人标识 -->
    <button class="side-menu__logo" type="button" @click="onLogoClick" aria-label="回到首页">
      <span class="side-menu__logo-mark">J.T.</span>
      <span class="side-menu__logo-text">Photography</span>
    </button>

    <!-- 作品集主菜单 -->
    <section class="side-menu__section" aria-labelledby="worksets">
      <h2 id="worksets" class="side-menu__heading">Worksets</h2>
      <ul class="side-menu__list">
        <MenuItem
          v-for="cat in mainCategories"
          :key="cat.key"
          :label="cat.label"
          :count="counts[cat.key]"
          :active="activeCategory === cat.key"
          @select="emit('select-category', cat.key)"
        />
      </ul>
    </section>

    <!-- 分隔线 -->
    <hr class="side-menu__divider" aria-hidden="true" />

    <!-- 次要菜单 -->
    <section class="side-menu__section">
      <h2 class="side-menu__heading">Studio</h2>
      <ul class="side-menu__list">
        <MenuItem
          label="关于摄影师"
          :active="activeCategory === 'about'"
          @select="emit('select-category', 'about')"
        />
        <MenuItem
          label="联系 / 约拍"
          :active="activeCategory === 'contact'"
          @select="emit('select-category', 'contact')"
        />
        <MenuItem
          label="留言墙"
          :active="activeCategory === 'guestbook'"
          @select="emit('select-category', 'guestbook')"
        />
      </ul>
    </section>

    <div class="side-menu__spacer"></div>

    <!-- 社交图标 -->
    <SocialIcons :size="18" />
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
}

.side-menu__logo-mark {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--c-ink);
}

.side-menu__logo-text {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--c-mid);
}

.side-menu__section {
  margin-bottom: var(--space-5);
}

.side-menu__heading {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--c-mid);
  margin: 0 0 var(--space-2) 16px;
}

.side-menu__list {
  display: flex;
  flex-direction: column;
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
