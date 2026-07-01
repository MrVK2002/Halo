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
  captionText: { type: String, default: '' },
  /**
   * 当传 true（默认）时，3D 旋转作用在内部 `tilted-card-inner` 上；
   * 传 false 则不应用 3D，但鼠标事件依旧 fire —— 由外部容器接管。
   * 配合外部在自身 ref 上监听 mouseenter/move/leave 自行驱动 transform 即可。
   */
  applyInnerTilt: { type: Boolean, default: true }
})

const emit = defineEmits(['mouseenter', 'mousemove', 'mouseleave'])

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

  if (innerRef.value && props.applyInnerTilt) {
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

  // caption 用 position: fixed + Teleport 渲染到 body 下，
  // 所以这里直接用视口绝对坐标，而不是相对 figure 的偏移。
  // 这样 caption 永远精确对齐鼠标，不受任何外层 transform 影响。
  captionX.value = e.clientX
  captionY.value = e.clientY

  const velocityY = offsetY - lastY.value
  captionRotate.value = -velocityY * 0.6
  lastY.value = offsetY

  emit('mousemove', {
    offsetX,
    offsetY,
    rotX,
    rotY,
    rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
  })
}

function handleMouseEnter(e) {
  targetScale.val = 1
  if (props.applyInnerTilt) {
    gsap.to(targetScale, { val: props.scaleOnHover, duration: 0.4, ease: 'power2.out' })
  }
  captionOpacity.val = 1
  emit('mouseenter', e)
}

function handleMouseLeave(e) {
  rotateX.value = 0
  rotateY.value = 0
  if (props.applyInnerTilt) resetAnimation()
  captionOpacity.val = 0
  captionRotate.value = 0
  emit('mouseleave', e)
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

    <!-- caption 通过 Teleport 渲染到 body 下，position: fixed 直接定位在视口坐标
         原因：caption 是 figure 的子元素，figure 又被外层 .photo-card 的 transform 旋转/缩放。
         如果 caption 在 figure 内部，rotateX/Y/Z 会带着它一起转，
         而 gsap.set(caption, { x, y }) 写的是 figure 局部坐标，
         旋转后视觉位置 ≠ 鼠标位置 —— 这就是之前 caption 不对齐鼠标的原因。
         用 Teleport 把它放到 body 下，外层 transform 完全传不过来，fixed 始终定位在视口。 -->
    <Teleport to="body">
      <div
        v-if="captionText"
        ref="captionRef"
        class="tilted-card-caption"
      >
        {{ captionText }}
      </div>
    </Teleport>
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
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tilted-card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transform: translateZ(0);
  display: block;
  filter: grayscale(100%);
}

/* caption 样式在下方非 scoped 块里 —— Teleport 出去的节点不匹配 scoped 属性选择器 */
</style>

<!-- 非 scoped style：caption 通过 Teleport 渲染到 body 下，
     scoped CSS 的 [data-v-xxx] 属性选择器不会作用到 Teleport 出去的节点。
     所以 caption 的样式必须放在这里。 -->
<style>
.tilted-card-caption {
  pointer-events: none;
  position: fixed;
  left: 0;
  top: 0;
  border-radius: 4px;
  background-color: #fff;
  padding: 4px 10px;
  font-size: 10px;
  color: #2d2d2d;
  opacity: 0;
  z-index: 9999;
  white-space: nowrap;
  will-change: transform, opacity;
}
</style>
