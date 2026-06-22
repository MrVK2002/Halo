<script setup>
import SocialIcons from './SocialIcons.vue'
</script>

<template>
  <section class="about-page" aria-label="关于我">
    <!-- 左侧：黑白肖像 -->
    <div class="about-page__photo-wrap" aria-hidden="true">
      <img
        class="about-page__photo"
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85"
        alt="Leo Liang 肖像"
        loading="eager"
      />
    </div>

    <!-- 右侧：内容 -->
    <div class="about-page__content">
      <div class="about-page__inner">
        <!-- 大标题 -->
        <h1 class="about-page__name">Leo Liang</h1>

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
  background: #000000;
}

.about-page__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 30% 0;
  filter: grayscale(100%);
  display: block;
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
