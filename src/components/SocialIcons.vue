<script setup>
defineProps({
  size: { type: Number, default: 16 }
})

const ICONS = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { id: 'x', label: 'X (Twitter)', href: 'https://x.com/' },
  { id: 'douyin', label: '抖音', href: 'https://www.douyin.com/' }
] 

function pathFor(id) {
  switch (id) {
    case 'instagram':
      return 'M3 7.5A4.5 4.5 0 0 1 7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5-1.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z'
    case 'x':
      return 'M3 3h4.5l4.5 6 5-6H20l-7 8.5L21 21h-4.5l-5-6.5L6 21H3l7.5-9.5L3 3z'
    case 'douyin':
      return 'M12 3v10.5a3 3 0 1 1-3-3 1 1 0 0 1 .25.02V8.5A5 5 0 1 0 14 13V8.4a7 7 0 0 0 4 1.25V7.5a5 5 0 0 1-4-2.5h-2V3z'
    default:
      return ''
  }
}
</script>

<template>
  <ul class="social-icons">
    <li v-for="item in ICONS" :key="item.id" class="social-icons__item">
      <a
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="item.label"
        :title="item.label"
        class="social-icons__link"
      >
        <svg
          :width="size"
          :height="size"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="square"
          stroke-linejoin="miter"
          aria-hidden="true"
        >
          <path :d="pathFor(item.id)" />
        </svg>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.social-icons {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.social-icons__item {
  display: flex;
}

.social-icons__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--c-mid);
  transition:
    color var(--t-base) var(--ease-out),
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.social-icons__link:hover {
  color: var(--c-ink);
  transform: translateY(-3px) scale(1.1);
}
</style>
