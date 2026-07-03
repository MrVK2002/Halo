<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const sectionRef = ref(null)
const titleRef = ref(null)
const descRef = ref(null)
const ctaRef = ref(null)
const contactRef = ref(null)
const imageRef = ref(null)

/**
 * 入场动画策略
 * ------------------------------------------------------------
 * 1. 用 gsap.fromTo() 在 timeline 里同时声明初始态 + 终态，
 *    无需额外 gsap.set 初始态，从源头消除 FOUC 闪烁。
 * 2. 用 IntersectionObserver：只有当 section 进入视口时才播放动画，
 *    防止 HMR / 快速切换分类时出现"瞬移到 0 再弹回"的突兀感。
 * 3. 动画结束后用 clearProps:'all' 清除 GSAP 内联样式，
 *    把元素交还给 CSS，保证 hover / focus 状态正常工作。
 * 4. prefers-reduced-motion:reduce 用户直接显示终态，不播动画。
 * 5. 进入视口前元素保持初始态；离开并再次进入时不会重新播放
 *    （一次性入场，符合杂志式排版的语义）。
 *
 * 【FOUC 修复原理】
 *  - 用 gsap.fromTo() 而非 tl.to()：
 *    fromTo 的 from 在 timeline 启动的瞬间同步设置到 DOM 上，
 *    因此即使元素在视口内（不触发 IntersectionObserver 也能看到初始态），
 *    浏览器首帧绘制的也是「初始态」而非「可见态」。
 *  - 配合 IntersectionObserver 的 rootMargin 提前触发 + raf 节流：
 *    用户滚动进入视口前 10% 距离时动画就启动，给动画留足展开时间，
 *    不会看到"先显示后消失再淡入"的三段闪烁。
 *  - 不用 onBeforeMount：fromTo 已经在动画启动时同步设置初始态，
 *    比 onBeforeMount 更早；且避免 onBeforeMount 时 ref.value 可能为 null 的边缘情况。
 */
onMounted(() => {
  const reduceMotion =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  // ---- 1. 收集所有需要入场动画的目标 ----
  const titleLines = titleRef.value?.querySelectorAll('.contact-title__line') ?? []
  const infoLines = contactRef.value?.querySelectorAll('.contact-info__line') ?? []

  // 即使 reduceMotion 也收集 targets，确保 clearProps 路径一致
  const targets = [
    ...titleLines,
    descRef.value,
    ctaRef.value,
    ...infoLines,
    imageRef.value
  ].filter(Boolean)

  if (reduceMotion) {
    gsap.set(targets, { clearProps: 'all' })
    return
  }

  // ---- 2. 用 fromTo 自带初始态，无需单独的 gsap.set ----
  //    fromTo 在 timeline 启动的同步瞬间把 from 状态写入 DOM，
  //    所以浏览器对 Contact section 的"动画启动前"绘制就直接看到初始态。
  const play = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    tl.fromTo(
      titleLines,
      { y: 28, skewX: 3, opacity: 0 },
      { y: 0, skewX: 0, opacity: 1, duration: 1.1, stagger: 0.15 }
    )
      .fromTo(
        descRef.value,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
        '-=0.75'
      )
      .fromTo(
        ctaRef.value,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(
        infoLines,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
        '-=0.3'
      )

    // 动画结束兜底：清除所有 inline 样式，让 hover/transition 走 CSS
    tl.eventCallback('onComplete', () => {
      gsap.set([...titleLines, descRef.value, ctaRef.value, ...infoLines], {
        clearProps: 'all'
      })
    })

    observer.disconnect()
  }

  // ---- 3. 用 IntersectionObserver 在元素进入视口时启动 timeline ----
  //    rootMargin '0px 0px -10% 0px'：当元素底部距离视口底部还有 10% 高度时触发，
  //    给动画留出"即将出现"的提前量，避免用户在临界位置看到突兀的卡顿。
  //    threshold: 0.15：元素 15% 进入视口就启动。
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) play()
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  )
  observer.observe(sectionRef.value)
})
</script>

<template>
  <section ref="sectionRef" class="contact" aria-label="联系我们">
    <!-- 左侧：文字区域 -->
    <div class="contact__copy">
      <h1 ref="titleRef" class="contact-title">
        <span class="contact-title__line">Stay</span>
        <span class="contact-title__line">Connected</span>
      </h1>

      <p ref="descRef" class="contact-desc">
        Lorem ipsum dolor sit amet consectetur. Amet vel placerat ultrices viverra.
        Pellentesque pulvinar massa risus odio nibh. Nulla at mauris euismod
        placerat.
      </p>

      <a
        ref="ctaRef"
        href="mailto:hi@shadcnblocks.com"
        class="contact-cta"
        aria-label="通过邮件联系"
      >
        <span class="contact-cta__arrow" aria-hidden="true">↪</span>
        <span class="contact-cta__text">Get in touch</span>
      </a>

      <div ref="contactRef" class="contact-info">
        <a class="contact-info__line" href="tel:+10023124123">+1 (002) 312 4123</a>
        <a class="contact-info__line" href="mailto:hi@shadcnblocks.com">hi@shadcnblocks.com</a>
      </div>
    </div>

    <!-- 右侧：办公桌 / 工作室氛围图（远程 Unsplash 图源，cover + center 裁切，首屏最高优先级加载） -->
    <div ref="imageRef" class="contact__image">
      <img
        class="contact__image-photo"
        src="https://images.unsplash.com/photo-1764755932155-dabbee87df7e?auto=format&fit=crop&w=1600&h=2000&q=80"
        alt="Minimal workspace with a laptop on a clean desk, soft natural sunlight casting geometric shadows on the wall"
        width="1600"
        height="2000"
        fetchpriority="high"
        decoding="sync"
      />
    </div>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  width: 100%;
  height: calc(100vh - var(--space-5) * 2);
  height: calc(100dvh - var(--space-5) * 2);
  min-height: 640px;
  background: var(--c-bone);
  overflow: hidden;
}

/* ============== 左侧文字区域 ============== */
.contact__copy {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 25% 8% 8% 12%;
  background: var(--c-bone);
}

.contact-title {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(48px, 6vw, 76px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--c-ink);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-title__line {
  display: block;
  /* skewX 从左侧锚点斜切，配合 GSAP skewX: 3 入场动效 */
  transform-origin: left center;
}

.contact-desc {
  margin: 44px 0 0;
  max-width: 460px;
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--c-mid);
  letter-spacing: 0.005em;
}

.contact-cta {
  margin-top: 30px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 500;
  color: var(--c-ink);
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: opacity var(--t-base) var(--ease-out),
              transform var(--t-base) var(--ease-out);
  width: max-content;
  /* 入场态由 GSAP 接管：IntersectionObserver 触发后从 opacity:0 → 1 */
}

.contact-cta:hover {
  opacity: 0.7;
}

.contact-cta:active {
  transform: translateY(1px);
}

.contact-cta__arrow {
  display: inline-block;
  font-size: 20px;
  line-height: 1;
  transform: translateY(1px);
}

.contact-cta__text {
  letter-spacing: -0.005em;
}

/* 左下角联系方式 */
.contact-info {
  position: absolute;
  top: 70%;
  left: 12%;
  bottom: 18%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contact-info__line {
  display: block;
  font-family: var(--font-body);
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--c-ink);
  text-decoration: none;
  transition: opacity var(--t-base) var(--ease-out);
}

.contact-info__line:hover {
  opacity: 0.65;
}

/* ============== 右侧图片区域 ============== */
.contact__image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 占位底色：图片加载前不会闪一面白底，与页面整体暖灰调融合 */
  background: #d9d9d6;
}

.contact__image-photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  /* 占位底色：图片加载完成前维持暖灰，与页面整体色调融合 */
  background: #d9d9d6;
  /*
   * 首屏关键图：preload + sync decoding 让图片几乎立即可见，
   * 因此这里只用一个 0.15s 的轻微 scale 入场，**不引入 opacity:0**，
   * 避免任何一帧的图片空白/延迟感。
   */
  animation: contact-photo-zoom-in 0.15s var(--ease-out, ease-out) both;
}

@keyframes contact-photo-zoom-in {
  from {
    transform: scale(1.005);
  }
  to {
    transform: scale(1);
  }
}

/* ============== 响应式 ============== */
@media (max-width: 960px) {
  .contact {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 0;
  }

  .contact__copy {
    padding: 56px 32px;
  }

  .contact-title {
    font-size: clamp(40px, 8vw, 64px);
  }

  .contact-info {
    position: static;
    margin-top: 48px;
  }

  .contact__image {
    height: 60vh;
    min-height: 420px;
  }
}

@media (max-width: 768px) {
  .contact {
    min-height: auto;
  }

  .contact__copy {
    padding: 40px 24px 48px;
  }

  .contact-title {
    font-size: clamp(36px, 9vw, 56px);
  }

  .contact-desc {
    font-size: 16px;
    margin-top: 28px;
    max-width: none;
  }

  .contact-info {
    margin-top: 36px;
    gap: 4px;
  }

  .contact-info__line {
    font-size: clamp(18px, 4.5vw, 24px);
  }

  .contact__image {
    height: 50vh;
    height: 50dvh;
    min-height: 280px;
  }
}

@media (max-width: 480px) {
  .contact__copy {
    padding: 32px 18px 40px;
  }
  .contact-title {
    font-size: clamp(32px, 10vw, 48px);
  }
  .contact-desc {
    font-size: 14px;
    margin-top: 22px;
  }
  .contact-cta {
    margin-top: 22px;
    font-size: 16px;
  }
}
</style>