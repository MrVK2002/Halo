<script setup>
import { ref, reactive } from 'vue'

/**
 * Guestbook 留言簿视图
 * - 卡片网格布局
 * - 简洁现代风格
 */

const SEED_NOTES = [
  { 
    name: 'Iris Wen', 
    date: '2025.05.12', 
    body: '夜街那组太有氛围感了，霓虹路口简直像一部王家卫。',
    featured: true
  },
  { 
    name: 'Marco V.', 
    date: '2025.05.09', 
    body: '海雾那张在 100% 显示下细节惊人。一直在猜是降噪前的 raw。',
    featured: false
  },
  { 
    name: '屿墙的猫', 
    date: '2025.04.28', 
    body: '街拍系列像是把上海折叠成了一张明信片。已收藏。',
    featured: true
  },
  { 
    name: '胶片偏执者', 
    date: '2025.04.21', 
    body: '颗粒残像这一档我盯了很久，想问下 Tri-X 推到多少？谢谢。',
    featured: false
  },
  { 
    name: '夜行者', 
    date: '2025.04.14', 
    body: '峡湾之晨的色温控制得太冷静了。推荐用做屏保。',
    featured: false
  },
  { 
    name: 'Hannah L.', 
    date: '2025.03.30', 
    body: '留言墙能换便签颜色这件事，小孩很开心。',
    featured: false
  },
  { 
    name: '阿松', 
    date: '2025.03.22', 
    body: '下一辑能不能去拍一次舟山？想去那边很久了。',
    featured: true
  },
  { 
    name: '陆也', 
    date: '2025.03.15', 
    body: '主页大图裁剪到 30% 顶部很聪明，眼睛一下就到位。',
    featured: false
  },
  { 
    name: '栗子茶', 
    date: '2025.03.08', 
    body: '雨天那组让我想学摄影，虽然大概会三天打鱼。',
    featured: false
  },
  {
    name: 'Vivian Hsu',
    date: '2025.02.26',
    body: '伊斯坦布尔天桥那张,光与影的切分让人整个下午都盯在屏幕上。',
    featured: true
  },
  {
    name: '林小满',
    date: '2025.02.18',
    body: '想问一下颗粒那档,是 LR 套的预设还是直接来自胶片扫描?差别挺大的。',
    featured: false
  },
  {
    name: '蓝山',
    date: '2025.02.10',
    body: '夜街系列让我换了一周屏保,每天开机都觉得舒服。已设。',
    featured: false
  },
  {
    name: 'Theo Park',
    date: '2025.02.02',
    body: 'Love the pacing across the gallery. The 16:9 hero crop sits perfectly on ultrawide.',
    featured: true
  },
  {
    name: '雾港',
    date: '2025.01.25',
    body: '港口凌晨那组让我立刻想买一张去东极岛的船票,凌晨四点的港口真的那种光。',
    featured: false
  },
  {
    name: 'K. Tanaka',
    date: '2025.01.17',
    body: '每一张都有自己的呼吸感。在堆量的年代里,这种克制挺难得。',
    featured: false
  },
  {
    name: '苏打绿',
    date: '2025.01.09',
    body: '想问下主页动效是 GSAP 还是 Motion One?想偷偷抄一份作业。',
    featured: true
  },
  {
    name: '北纬',
    date: '2025.01.02',
    body: '留言墙的字体层级舒服,一路滚下来眼睛不累。新年快乐。',
    featured: false
  },
  {
    name: '木木',
    date: '2024.12.24',
    body: '船厂那组黑白,喜欢到想洗一张 11x14 贴在书桌上方。请问能开放售卖吗?',
    featured: false
  },
  {
    name: '余白',
    date: '2024.12.15',
    body: '主页标题那个英文字体是 Inter Tight 的哪个字重?同问小字辅助用的是几号。',
    featured: false
  }
]  // 共 19 条

const notes = ref([...SEED_NOTES])

const formOpen = ref(false)
const draft = reactive({ name: '', body: '' })
const errors = reactive({ name: '', body: '' })

function openForm() {
  formOpen.value = true
}

function toggleForm() {
  if (formOpen.value) {
    closeForm()
  } else {
    openForm()
  }
}

function closeForm() {
  formOpen.value = false
  errors.name = ''
  errors.body = ''
  draft.name = ''
  draft.body = ''
}

function validate() {
  errors.name = draft.name.trim() ? '' : '请输入昵称'
  errors.body = draft.body.trim() ? '' : '写点什么吧'
  return !errors.name && !errors.body
}

function submitNote() {
  if (!validate()) return
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const newNote = {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: draft.name.trim(),
    body: draft.body.trim(),
    date: `${yyyy}.${mm}.${dd}`,
    featured: false
  }
  notes.value = [newNote, ...notes.value]
  draft.name = ''
  draft.body = ''
  errors.name = ''
  errors.body = ''
  formOpen.value = false
}
</script>

<template>
  <section class="guestbook" aria-label="留言簿">
    <!-- 顶部栏:标题 + 计数 + 操作 -->
    <header class="guestbook__top">
      <div class="guestbook__title-wrap">
        <h1 class="guestbook__title">留言簿</h1>
        <span class="guestbook__title-en">Guestbook</span>
        <span class="guestbook__count">{{ notes.length }} 条留言</span>
      </div>

      <div class="guestbook__actions">
        <button
          type="button"
          class="guestbook__leave-btn"
          :aria-expanded="formOpen"
          aria-controls="guestbook-form"
          @click="toggleForm"
        >
          <span class="guestbook__leave-btn-icon" aria-hidden="true"></span>
          留下足迹
        </button>
      </div>
    </header>

    <!-- 内联表单 -->
    <Transition name="guestbook-form">
      <form
        v-show="formOpen"
        id="guestbook-form"
        class="guestbook__form"
        novalidate
        @submit.prevent="submitNote"
      >
        <label class="guestbook__field">
          <span class="guestbook__field-label">昵称 / Nickname</span>
          <input
            v-model="draft.name"
            type="text"
            class="guestbook__input"
            :class="{ 'is-error': errors.name }"
            maxlength="32"
            autocomplete="off"
            placeholder="留下你的名字……"
          />
          <span v-if="errors.name" class="guestbook__field-error">{{ errors.name }}</span>
        </label>

        <label class="guestbook__field guestbook__field--block">
          <span class="guestbook__field-label">留言 / Message</span>
          <textarea
            v-model="draft.body"
            class="guestbook__input guestbook__textarea"
            :class="{ 'is-error': errors.body }"
            rows="3"
            maxlength="280"
            placeholder="说点什么……"
          ></textarea>
          <span v-if="errors.body" class="guestbook__field-error">{{ errors.body }}</span>
        </label>

        <div class="guestbook__form-actions">
          <button type="button" class="guestbook__btn guestbook__btn--ghost" @click="closeForm">
            取消
          </button>
          <button type="submit" class="guestbook__btn guestbook__btn--solid">
            提交
          </button>
        </div>
      </form>
    </Transition>

    <!-- 卡片网格 -->
    <div class="guestbook__grid">
      <article
        v-for="(note, index) in notes"
        :key="note.id"
        class="guestbook-card"
        :class="{
          'guestbook-card--featured': note.featured,
          'guestbook-card--tall': index % 5 === 1 || index % 5 === 3,
          'guestbook-card--wide': index % 7 === 0
        }"
      >
        <header class="guestbook-card__header">
          <h2 class="guestbook-card__name">{{ note.name }}</h2>
          <time class="guestbook-card__date">{{ note.date }}</time>
        </header>
        
        <p class="guestbook-card__body">{{ note.body }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
/* ====================================================================
   容器
==================================================================== */
.guestbook {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - var(--space-5) * 2);
  padding: var(--space-5) var(--space-4);
}

/* ====================================================================
   顶部栏
==================================================================== */
.guestbook__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-5);
  padding: 0 0 var(--space-5);
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: var(--space-6);
}

.guestbook__title-wrap {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.guestbook__title {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin: 0;
}

.guestbook__title-en {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #888888;
}

.guestbook__count {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #666666;
  padding-left: var(--space-3);
  border-left: 1px solid #e0e0e0;
  margin-left: var(--space-2);
}

/* ====================================================================
   顶部操作按钮
==================================================================== */
.guestbook__leave-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #1a1a1a;
  color: #ffffff;
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.guestbook__leave-btn:hover {
  background: #333333;
  transform: translateY(-1px);
}

.guestbook__leave-btn:active {
  transform: translateY(0);
}

.guestbook__leave-btn-icon {
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  display: inline-block;
  width: 12px;
  height: 12px;
  position: relative;
  color: currentColor;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.guestbook__leave-btn-icon::before,
.guestbook__leave-btn-icon::after {
  content: '';
  position: absolute;
  background: currentColor;
  border-radius: 1px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s ease;
}

.guestbook__leave-btn-icon::before {
  /* 横线（加减号共有） */
  top: 50%;
  left: 0;
  width: 100%;
  height: 1.5px;
  transform: translateY(-50%);
}

.guestbook__leave-btn-icon::after {
  /* 竖线（仅加号有） */
  top: 50%;
  left: 50%;
  width: 1.5px;
  height: 100%;
  transform: translate(-50%, -50%);
}

/* 表单展开时：竖线淡出并旋转，变成减号 */
button[aria-expanded="true"] .guestbook__leave-btn-icon {
  transform: rotate(180deg);
}

button[aria-expanded="true"] .guestbook__leave-btn-icon::after {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(90deg);
}

button[aria-expanded="false"] .guestbook__leave-btn-icon::after {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0deg);
}

/* ====================================================================
   内联表单
==================================================================== */
.guestbook__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  margin-bottom: var(--space-6);
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-shadow:
    6px 6px 0 #e8e8e8,
    0 8px 24px -8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform-origin: top center;
}

/* ====================================================================
   表单过渡动画 (Vue Transition)
==================================================================== */
.guestbook-form-enter-active {
  transition:
    max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.35s ease-out,
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    margin-bottom 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    padding 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.guestbook-form-leave-active {
  transition:
    max-height 0.35s cubic-bezier(0.55, 0, 0.65, 0.15),
    opacity 0.25s ease-in,
    transform 0.35s cubic-bezier(0.55, 0, 0.65, 0.15),
    margin-bottom 0.35s cubic-bezier(0.55, 0, 0.65, 0.15),
    padding 0.35s cubic-bezier(0.55, 0, 0.65, 0.15);
}

.guestbook-form-enter-from {
  opacity: 0;
  transform: translateY(-16px) scale(0.96);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

.guestbook-form-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
  max-height: 600px;
}

.guestbook-form-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  max-height: 600px;
}

.guestbook-form-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* 旧 keyframes（保留以防其他场景使用） */
@keyframes formIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.guestbook__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guestbook__field--block {
  flex: 1;
}

.guestbook__field-label {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666666;
}

.guestbook__input {
  padding: 12px 16px;
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.guestbook__input:focus {
  outline: none;
  border-color: #1a1a1a;
  background: #ffffff;
}

.guestbook__input::placeholder {
  color: #b8b8b8;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.guestbook__input.is-error {
  border-color: #e53935;
}

.guestbook__textarea {
  resize: none;
  min-height: 80px;
}

.guestbook__field-error {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  color: #e53935;
}

.guestbook__form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.guestbook__btn {
  padding: 10px 20px;
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.guestbook__btn--solid {
  background: #1a1a1a;
  color: #ffffff;
  border: 1px solid #1a1a1a;
}

.guestbook__btn--solid:hover {
  background: #333333;
}

.guestbook__btn--ghost {
  background: transparent;
  color: #666666;
  border: 1px solid #e0e0e0;
}

.guestbook__btn--ghost:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}

/* ====================================================================
   卡片网格布局
==================================================================== */
.guestbook__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  grid-auto-flow: dense;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .guestbook__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .guestbook__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .guestbook__grid {
    grid-template-columns: 1fr;
  }
}

/* ====================================================================
   卡片样式
==================================================================== */
.guestbook-card {
  position: relative;
  background: #ffffff;
  border-radius: 2px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow:
    8px 8px 0 #e8e8e8,
    0 12px 32px -8px rgba(0, 0, 0, 0.12);
  transition: all 0.25s ease;
}

.guestbook-card:hover {
  transform: translateY(-3px) rotate(-0.5deg);
  box-shadow:
    12px 12px 0 #e0e0e0,
    0 20px 48px -10px rgba(0, 0, 0, 0.18);
}

/* 特色卡片 - 更大尺寸 */
.guestbook-card--featured {
  grid-column: span 2;
  grid-row: span 2;
  padding: 32px;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  box-shadow:
    12px 12px 0 #e0e0e0,
    0 16px 40px -10px rgba(0, 0, 0, 0.15);
}

.guestbook-card--featured:hover {
  box-shadow:
    16px 16px 0 #d8d8d8,
    0 24px 56px -12px rgba(0, 0, 0, 0.2);
}

.guestbook-card--featured .guestbook-card__body {
  font-size: 18px;
  line-height: 1.6;
}

/* 高卡片 */
.guestbook-card--tall {
  grid-row: span 2;
  box-shadow:
    10px 10px 0 #e8e8e8,
    0 14px 36px -8px rgba(0, 0, 0, 0.13);
}

.guestbook-card--tall:hover {
  box-shadow:
    14px 14px 0 #e0e0e0,
    0 22px 52px -10px rgba(0, 0, 0, 0.18);
}

/* 宽卡片 */
.guestbook-card--wide {
  grid-column: span 2;
  box-shadow:
    10px 10px 0 #e8e8e8,
    0 14px 36px -8px rgba(0, 0, 0, 0.13);
}

.guestbook-card--wide:hover {
  box-shadow:
    14px 14px 0 #e0e0e0,
    0 22px 52px -10px rgba(0, 0, 0, 0.18);
}

/* 卡片头部 */
.guestbook-card__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guestbook-card__name {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 0.02em;
}

.guestbook-card__date {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #999999;
  letter-spacing: 0.05em;
}

/* 卡片正文 */
.guestbook-card__body {
  font-family: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: #444444;
  margin: 0;
  flex: 1;
}

/* ====================================================================
   响应式布局
==================================================================== */
@media (max-width: 480px) {
  .guestbook {
    padding: var(--space-4) var(--space-3);
  }
  
  .guestbook__top {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }

  .guestbook-card--featured {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .guestbook-card--wide {
    grid-column: span 1;
  }
  
  .guestbook-card--tall {
    grid-row: span 1;
  }
}

/* ====================================================================
   减弱动效:用户偏好 prefers-reduced-motion
==================================================================== */
@media (prefers-reduced-motion: reduce) {
  .guestbook-form-enter-active,
  .guestbook-form-leave-active {
    transition: none !important;
  }
  
  .guestbook-card {
    transition: none !important;
  }
  
  .guestbook-card:hover {
    transform: none;
  }
  
  .guestbook__leave-btn {
    transition: none !important;
  }
}
</style>
