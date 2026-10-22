<script setup>
const props = defineProps({
  labelEN: { type: String, required: true },
  labelCN: { type: String, default: '' },
  active: { type: Boolean, default: false }
})
defineEmits(['select'])
</script>

<template>
  <li
    class="menu-item"
    :class="{ 'is-active': active }"
    @click="$emit('select')"
    role="button"
    :aria-pressed="active"
    tabindex="0"
    @keydown.enter="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <span class="menu-item__bar" aria-hidden="true"></span>
    <span class="menu-item__labels">
      <span class="menu-item__label-en">{{ labelEN }}</span>
      <span v-if="labelCN" class="menu-item__label-cn">{{ labelCN }}</span>
    </span>
  </li>
</template>

<style scoped>
.menu-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: 10px 0 10px 16px;
  cursor: pointer;
  user-select: none;
  transition: color var(--t-base) var(--ease-out);
  outline: none;
}

.menu-item__labels {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 1;
  transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.menu-item__bar {
  display: none;
}

.menu-item:hover .menu-item__labels {
  transform: scale(0.95) translateX(4px);
}

.menu-item__label-en {
  font-family: 'SourceHanSansSC-VF', 'Noto Sans SC', 'PingFang SC', sans-serif;
  /* 继承侧栏基准字号（随屏幕自适应） */
  font-size: 1em;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--c-ink);
  transition: color 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.4;
}

.menu-item__label-cn {
  font-family: 'SourceHanSansSC-VF', 'Noto Sans SC', 'PingFang SC', sans-serif;
  /* 12 / 14 ≈ 0.857em */
  font-size: 0.857em;
  font-weight: 300;
  letter-spacing: 0.04em;
  color: #888888;
  transition: color 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.4;
}

.menu-item:hover {
  color: var(--c-ink);
}

.menu-item:hover .menu-item__label-en,
.menu-item:hover .menu-item__label-cn {
  color: var(--c-ink);
}

.menu-item:hover .menu-item__label-cn {
  color: var(--c-soft);
}

.menu-item.is-active .menu-item__label-en {
  color: var(--c-ink);
  font-weight: 500;
}

.menu-item.is-active .menu-item__label-cn {
  color: var(--c-soft);
  font-weight: 400;
}
</style>
