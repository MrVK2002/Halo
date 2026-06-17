<script setup>
const props = defineProps({
  label: { type: String, required: true },
  count: { type: Number, default: null },
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
    <span class="menu-item__label">{{ label }}</span>
    <span v-if="count !== null" class="menu-item__count">{{ count }}</span>
  </li>
</template>

<style scoped>
.menu-item {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  padding: 10px 0 10px 16px;
  font-family: var(--font-body);
  font-size: var(--fs-md);
  font-weight: 400;
  color: var(--c-soft);
  cursor: pointer;
  user-select: none;
  transition: color var(--t-base) var(--ease-out);
  outline: none;
}

.menu-item__bar {
  position: absolute;
  left: 0;
  top: 50%;
  width: 0;
  height: 14px;
  background: var(--c-ink);
  transform: translateY(-50%);
  transition: width var(--t-base) var(--ease-out);
}

.menu-item__label {
  flex: 1;
  letter-spacing: 0.01em;
}

.menu-item__count {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  color: var(--c-mid);
  letter-spacing: 0;
}

.menu-item:hover {
  color: var(--c-ink);
}

.menu-item:hover .menu-item__bar {
  width: 2px;
  background: var(--c-mid);
}

.menu-item:focus-visible .menu-item__bar {
  width: 2px;
  background: var(--c-ink);
}

.menu-item.is-active {
  color: var(--c-ink);
  font-weight: 500;
}

.menu-item.is-active .menu-item__bar {
  width: 2px;
  background: var(--c-ink);
}
</style>
