<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useLightbox } from '@/composables/useLightbox.js'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['close'])

const { open, close } = useLightbox()

function openByIndex(index) {
  open(index, props.items)
  document.body.style.overflow = 'hidden'
}

function onPswpClose() {
  document.body.style.overflow = ''
  emit('close')
}

onMounted(() => {
  // PhotoSwipe 自带 DOM（按需创建），无需在模板放容器
})
onBeforeUnmount(() => {
  close()
  document.body.style.overflow = ''
})

defineExpose({ openByIndex })
</script>

<template>
  <!-- PhotoSwipe 5.x 会自动 append 自己的 root 到 body -->
</template>

<style>
/* 全局覆盖 PhotoSwipe 内置圆角，与 brief 严格一致：所有元素零圆角 */
.pswp__button,
.pswp__img,
.pswp__bg,
.pswp__ui,
.pswp__top-bar,
.pswp__caption,
.pswp__caption__center,
.pswp__counter,
.pswp__custom-caption,
.pswp__item,
.pswp__zoom-wrap,
.pswp__zoom-wrap > * {
  border-radius: 0 !important;
}

.pswp__bg {
  background: #000;
}

.pswp__top-bar {
  background: transparent !important;
}

.pswp__button {
  background-color: transparent;
  color: #fff;
  opacity: 0.7;
  transition: opacity 0.2s ease-out;
}

.pswp__button:hover {
  opacity: 1;
}

/* 自定义 EXIF 信息栏 */
.pswp__caption__center {
  max-width: 900px;
  text-align: center;
  color: #fff;
  font-family: var(--font-body);
  padding: 12px 24px;
}

.pswp-caption-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: #fff;
  margin-bottom: 4px;
}

.pswp-caption-exif {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
}
</style>
