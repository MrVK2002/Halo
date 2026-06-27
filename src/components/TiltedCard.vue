<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  imageSrc: { type: String, required: true },
  altText: { type: String, default: '' },
  containerHeight: { type: String, default: '100%' },
  containerWidth: { type: String, default: '100%' },
  imageHeight: { type: String, default: '100%' },
  imageWidth: { type: String, default: '100%' },
  rotateAmplitude: { type: Number, default: 12 },
  scaleOnHover: { type: Number, default: 1.05 },
  captionText: { type: String, default: '' }
})

const emit = defineEmits(['mouseenter', 'mouseleave'])

const figureRef = ref(null)
const innerRef = ref(null)
const captionRef = ref(null)

// 鼠标位置
const rotateX = ref(0)
const rotateY = ref(0)
const captionX = ref(0)
const captionY = ref(0)
const captionRotate = ref(0)
const lastY = ref(0)

// 动画目标值（用于 spring 效果）
const targetRotateX = { val: 0 }
const targetRotateY = { val: 0 }
const targetScale = { val: 1 }
const captionOpacity = { val: 0 }

// 恢复动画
function resetAnimation() {
  gsap.to(targetRotateX, { val: 0, duration: 1.2, ease: 'power2.out' })
  gsap.to(targetRotateY, { val: 0, duration: 1.2, ease: 'power2.out' })
  gsap.to(targetScale, { val: 1, duration: 0.8, ease: 'power2.out' })
}

// gsap ticker 实现 spring
let tickerActive = true

function springUpdate() {
  if (!tickerActive) return

  // 降低 spring 系数使动画更慢、更迟钝
  const dampingFactor = 0.06

  // spring 插值
  targetRotateX.val += (rotateX.value - targetRotateX.val) * dampingFactor
  targetRotateY.val += (rotateY.value - targetRotateY.val) * dampingFactor

  const currentScale = innerRef.value ? parseFloat(gsap.getProperty(innerRef.value, 'scale')) || 1 : 1
  targetScale.val += (currentScale - targetScale.val) * dampingFactor

  if (innerRef.value) {
    gsap.set(innerRef.value, {
      rotateX: -targetRotateX.val,
      rotateY: targetRotateY.val,
      scale: targetScale.val
    })
  }

  if (captionRef.value) {
    gsap.set(captionRef.value, {
      x: captionX.value,
      y: captionY.value,
      rotate: captionRotate.value,
      opacity: captionOpacity.val
    })
  }

  requestAnimationFrame(springUpdate)
}

function handleMouseMove(e) {
  if (!figureRef.value) return

  const rect = figureRef.value.getBoundingClientRect()
  const offsetX = e.clientX - rect.left - rect.width / 2
  const offsetY = e.clientY - rect.top - rect.height / 2

  const rotX = (offsetY / (rect.height / 2)) * -props.rotateAmplitude
  const rotY = (offsetX / (rect.width / 2)) * props.rotateAmplitude

  rotateX.value = rotX
  rotateY.value = rotY

  captionX.value = e.clientX - rect.left
  captionY.value = e.clientY - rect.top

  const velocityY = offsetY - lastY.value
  captionRotate.value = -velocityY * 0.6
  lastY.value = offsetY
}

function handleMouseEnter() {
  targetScale.val = 1
  gsap.to(targetScale, { val: props.scaleOnHover, duration: 0.4, ease: 'power2.out' })
  captionOpacity.val = 1
  emit('mouseenter')
}

function handleMouseLeave() {
  rotateX.value = 0
  rotateY.value = 0
  resetAnimation()
  captionOpacity.val = 0
  captionRotate.value = 0
  emit('mouseleave')
}

onMounted(() => {
  tickerActive = true
  springUpdate()

  // 模糊渐清动画
  const img = innerRef.value?.querySelector('.tilted-card-img')
  if (img) {
    gsap.fromTo(img,
      { filter: 'grayscale(100%) blur(16px)' },
      { filter: 'grayscale(100%) blur(0px)', duration: 1.2, ease: 'power2.out' }
    )
  }
})

onUnmounted(() => {
  tickerActive = false
})
</script>

<template>
  <figure
    ref="figureRef"
    class="tilted-card-figure"
    :style="{
      height: containerHeight,
      width: containerWidth
    }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div ref="innerRef" class="tilted-card-inner" :style="{ width: imageWidth, height: imageHeight }">
      <img
        :src="imageSrc"
        :alt="altText"
        class="tilted-card-img"
        :style="{ width: imageWidth, height: imageHeight }"
      />
    </div>

    <figcaption
      v-if="captionText"
      ref="captionRef"
      class="tilted-card-caption"
    >
      {{ captionText }}
    </figcaption>
  </figure>
</template>

<style scoped>
.tilted-card-figure {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tilted-card-inner {
  position: relative;
  transform-style: preserve-3d;
  border-radius: 5px;
  margin: -20px;
  padding: 20px;
}

.tilted-card-img {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  border-radius: 15px;
  will-change: transform;
  transform: translateZ(0);
  display: block;
  filter: grayscale(100%);
}

.tilted-card-caption {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 4px;
  background-color: #fff;
  padding: 4px 10px;
  font-size: 10px;
  color: #2d2d2d;
  opacity: 0;
  z-index: 3;
  white-space: nowrap;
}
</style>
