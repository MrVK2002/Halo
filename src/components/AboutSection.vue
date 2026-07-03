<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import SocialIcons from './SocialIcons.vue'
import TiltedCard from './TiltedCard.vue'

const contentRef = ref(null)
const photoCardRef = ref(null)

// 3D 倾斜由手写 RAF 平滑循环驱动 —— 完全不依赖 gsap.to / quickTo，
// 避免 tween 之间互相 kill 导致的「第二次 hover 后 3D 倾斜消失」问题。
const targetRot = { x: 0, y: 0 }
const currentRot = { x: 0, y: 0 }
let targetScale = 1
let currentScale = 1
let isHovering = false
let rafId = null

function lerp(start, end, t) {
  return start + (end - start) * t
}

function tick() {
  const card = photoCardRef.value
  if (!card) {
    rafId = null
    return
  }
  // 平滑系数 0.15，越大越快追上目标
  const ease = 0.15
  currentRot.x = lerp(currentRot.x, targetRot.x, ease)
  currentRot.y = lerp(currentRot.y, targetRot.y, ease)
  currentScale = lerp(currentScale, targetScale, ease)
  // 写入 transform
  card.style.transform =
    `rotateX(${currentRot.x}deg) ` +
    `rotateY(${currentRot.y}deg) ` +
    `rotateZ(-3deg) ` +
    `scale(${currentScale})`
  rafId = requestAnimationFrame(tick)
}

function ensureRaf() {
  if (rafId === null) rafId = requestAnimationFrame(tick)
}

function handlePhotoMouseMove(e) {
  const card = photoCardRef.value
  if (!card) return
  if (typeof window !== 'undefined') {
    const isTouch =
      ('ontouchstart' in window) ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    if (isTouch) return // 触屏不做 3D 倾斜
  }
  const rect = card.getBoundingClientRect()
  const offsetX = e.clientX - rect.left - rect.width / 2
  const offsetY = e.clientY - rect.top - rect.height / 2
  const amplitude = 2
  targetRot.x = (offsetY / (rect.height / 2)) * -amplitude
  targetRot.y = (offsetX / (rect.width / 2)) * amplitude
  ensureRaf()
}

function handlePhotoMouseEnter() {
  if (typeof window !== 'undefined') {
    const isTouch =
      ('ontouchstart' in window) ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    if (isTouch) return // 触屏不触发放大
  }
  isHovering = true
  targetScale = 1.04
  ensureRaf()
}

function handlePhotoMouseLeave() {
  isHovering = false
  // 鼠标移出：旋转归零、缩放归位。Z 轴的 -3deg 已硬编码在 style.transform 中。
  targetRot.x = 0
  targetRot.y = 0
  targetScale = 1
  ensureRaf()
}

onMounted(() => {
  // 启动 RAF 循环（即使还没 hover，循环也跑，保证 initial transform 已生效）
  ensureRaf()

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // 1. 姓名两行依次弹出
  const firstName = contentRef.value?.querySelector('.name-first')
  const lastName = contentRef.value?.querySelector('.name-last')
  if (firstName) tl.fromTo(firstName, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7 })
  if (lastName) tl.fromTo(lastName, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7 }, '-=0.5')

  // 2. 副标题、简介、图标依次淡入
  tl.fromTo(contentRef.value?.querySelector('.about-page__title'),
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    '-=0.4'
  )
  tl.fromTo(contentRef.value?.querySelector('.about-page__bio'),
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.35'
  )
  tl.fromTo(contentRef.value?.querySelector('.social-icons'),
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5 },
    '-=0.3'
  )
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <section ref="sectionRef" class="about-page" aria-label="关于我">
    <!-- 左侧：黑白肖像（Polaroid 相纸容器） -->
    <div class="about-page__photo-wrap" aria-hidden="true">
      <div
        ref="photoCardRef"
        class="photo-card photo-card--polaroid"
        @mousemove="handlePhotoMouseMove"
        @mouseenter="handlePhotoMouseEnter"
        @mouseleave="handlePhotoMouseLeave"
      >
        <div class="photo-frame">
          <TiltedCard
            image-src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85"
            alt-text="Leo Liang 肖像"
            container-height="100%"
            container-width="100%"
            image-height="100%"
            image-width="100%"
            caption-text="Leo Liang"
            :rotate-amplitude="0"
            :scale-on-hover="1"
            :apply-inner-tilt="false"
          />
        </div>
        <div class="photo-card__caption" aria-hidden="true">
          <span class="photo-card__name">Leo Liang</span>
          <span class="photo-card__email">leo@mr-vk.studio</span>
        </div>
      </div>
    </div>

    <!-- 右侧：内容 -->
    <div class="about-page__content">
      <div ref="contentRef" class="about-page__inner">
        <!-- 大标题 -->
        <h1 class="about-page__name">
          <span class="name-first">Leo</span>
          <span class="name-last">Liang</span>
        </h1>

        <!-- 副标题 -->
        <p class="about-page__title">Software Engineer / Freelance Photographer</p>

        <!-- 简介 -->
        <p class="about-page__bio">
          Based in Shanghai. By day, building distributed systems at a fintech startup.
          By night and weekends, chasing available light and quiet moments — from the
          neon-lit streets of Shanghai to the open landscapes of the Tibetan plateau.
          Fascinated by the tension between permanence and transience, between
          engineered order and organic chaos. Shooting film and digital in parallel.
        </p>

        <!-- 社交图标 -->
        <SocialIcons :size="18" />
      </div>
    </div>
  </section>
</template>

<style scoped>
@font-face {
  font-family: 'Aidian-SignatureTi';
  src: url('@/assets/font/Aidian-SignatureTi.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.about-page {
  display: flex;
  width: 100%;
  height: 94vh;
  overflow: hidden;
  background: #ffffff;
}

/* 左侧肖像 */
.about-page__photo-wrap {
  position: relative;
  flex: 0 0 50%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px; /* 给相纸 3D 旋转提供观察视角 */
}

/* Polaroid 相纸容器 */
.photo-card {
  position: relative;
  width: 78%;
  aspect-ratio: 2 / 3; /* 相纸宽高比 4:5，含下方留白 */
  background: #ffffff;
  border-radius: 2px;
  padding: 18px 18px 72px; /* 三边略宽，下方加宽作为相纸留白 */
  box-sizing: border-box;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 22px 48px -16px rgba(0, 0, 0, 0.30),
    0 40px 72px -28px rgba(0, 0, 0, 0.20);
  cursor: pointer;
  transform-style: preserve-3d;
  transform-origin: center center;
  will-change: transform;
  /* 静态 transform 由 GSAP 在 onMounted 里设置：rotationZ: -3
     鼠标 hover 后旋转、缩放继续由 GSAP 接管 */
}

/* 相纸四角微微泛黄，做出被岁月洗过的质感 */
.photo-card::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(210, 190, 150, 0.10) 0%,
    rgba(0, 0, 0, 0) 35%,
    rgba(0, 0, 0, 0) 65%,
    rgba(210, 190, 150, 0.10) 100%
  );
}

/* 相纸内照片区域 */
.photo-frame {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 相纸左下角文字 caption：姓名 + 邮箱两行 */
.photo-card__caption {
  position: absolute;
  left: 22px;
  bottom: 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  line-height: 1.1;
  pointer-events: none;
}

.photo-card__name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #1a1a1a;
}

.photo-card__email {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--c-mid);
}

/* 右侧内容 */
.about-page__content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 6vw;
  overflow-y: auto;
}

.about-page__inner {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 大标题：签名字体 */
.about-page__name {
  font-family: 'Aidian-SignatureTi', 'Newsreader', Georgia, 'Songti SC', serif;
  font-size: clamp(52px, 6vw, 50px);
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
  color: #000000;
  margin: 0 0 28px;
}

.name-first,
.name-last {
  display: block;
  margin-top: 15px;
}

/* 副标题：无衬线灰色大写 */
.about-page__title {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #000000;
  margin: 0 0 40px;
}

/* 简介正文 */
.about-page__bio {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
  font-size: clamp(14px, 1.4vw, 16px);
  font-weight: 300;
  line-height: 1.85;
  color: #888888;
  margin-bottom: 20px;
  max-width: 48ch;
}

/* 操作区 */
.about-page__actions {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 52px;
}

/* 减弱动效：尊重用户偏好（3D 旋转已由 GSAP 接管，gsap 默认会看媒体查询） */
/* 响应式 —— 极小屏：用 flex 纵向滚动替代 100vh / 两栏 */
@media (max-width: 768px) {
  .about-page {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .about-page__photo-wrap {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    padding: 40px 24px 24px;
  }

  .photo-card {
    width: min(82%, 360px);
    margin: 0 auto;
  }

  .about-page__content {
    flex: 0 0 auto;
    width: 100%;
    padding: 24px 7vw 56px;
    overflow-y: visible;
  }

  .about-page__name {
    font-size: clamp(36px, 10vw, 56px);
  }
}

@media (max-width: 480px) {
  .about-page__photo-wrap {
    padding: 24px 16px 16px;
  }
  .about-page__content {
    padding: 16px 6vw 40px;
  }
  .about-page__name {
    font-size: clamp(32px, 11vw, 44px);
  }
}
</style>
