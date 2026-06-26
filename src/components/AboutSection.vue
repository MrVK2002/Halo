<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import SocialIcons from './SocialIcons.vue'

const photoRef = ref(null)
const contentRef = ref(null)

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // 1. 照片从左侧滑入
  tl.fromTo(photoRef.value,
    { x: -80, opacity: 0, scale: 1.05 },
    { x: 0, opacity: 1, scale: 1, duration: 1.2 }
  )

  // 2. 姓名两行依次弹出
  const firstName = contentRef.value?.querySelector('.name-first')
  const lastName = contentRef.value?.querySelector('.name-last')
  if (firstName) tl.fromTo(firstName, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7 }, '-=1')
  if (lastName) tl.fromTo(lastName, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7 }, '-=0.5')

  // 3. 副标题、简介、图标依次淡入
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
</script>

<template>
  <section ref="sectionRef" class="about-page" aria-label="关于我">
    <!-- 左侧：黑白肖像 -->
    <div class="about-page__photo-wrap" aria-hidden="true">
      <img
        ref="photoRef"
        class="about-page__photo"
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85"
        alt="Leo Liang 肖像"
        loading="eager"
      />
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
  overflow: hidden;
}

.about-page__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 30% 0;
  filter: grayscale(100%);
  display: block;
  border-radius: 5px;
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

/* 大标题：衬线 ultra-wide */
.about-page__name {
  font-family: 'Newsreader', Georgia, 'Songti SC', serif;
  font-size: clamp(52px, 6vw, 88px);
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  line-height: 1;
  color: #000000;
  margin: 0 0 28px;
}

.name-first,
.name-last {
  display: block;
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
</style>
