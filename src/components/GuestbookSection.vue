<script setup>
import { ref, computed, reactive } from 'vue'
import MasonryGrid from './MasonryGrid.vue'

/**
 * Guestbook 视图
 * - 软木板背景 + 便签瀑布流
 * - 鼠标悬浮便签：上浮 + 加深阴影 + 轻微增加旋转
 * - 顶部"留下便签"按钮 → 内联表单（淡入 0.22s）→ 提交后新便签以动画进入
 *
 * 数据为前端本地假数据（占位），等后端 API 就绪后替换 fetch 即可。
 * 字段结构是合同：{ id, name, date, body, rating? }
 */

// 调色板按 brief 严格取色（占比百分比用于首次随机）
const PALETTE = [
  { bg: '#FFFA9E', weight: 40 }, // 明黄
  { bg: '#A8E6CF', weight: 20 }, // 淡蓝
  { bg: '#FFD3B6', weight: 20 }, // 淡粉
  { bg: '#C7F9CC', weight: 10 }, // 淡绿
  { bg: '#E0BBE4', weight: 10 }  // 淡紫
]

function pickColor() {
  const total = PALETTE.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (const p of PALETTE) {
    r -= p.weight
    if (r <= 0) return p.bg
  }
  return PALETTE[0].bg
}

function makeNote({ name, date, body, rating }) {
  return {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    date,
    body,
    rating: rating ?? 0,
    color: pickColor(),
    // 旋转角度 -5 ~ 8 度，按 brief
    rotate: (Math.random() * 13 - 5).toFixed(2),
    // 用来错落进入动画
    enterDelay: Math.floor(Math.random() * 240)
  }
}

const SEED_NOTES = [
  { name: 'Iris Wen', date: '2025.05.12', body: '夜街那组太有氛围感了,霓虹路口简直像一部王家卫。', rating: 5 },
  { name: 'Marco V.', date: '2025.05.09', body: '海雾那张在 100% 显示下细节惊人。一直在猜是降噪前的 raw。', rating: 4 },
  { name: '屿墙的猫', date: '2025.04.28', body: '街拍系列像是把上海折叠成了一张明信片。已收藏。', rating: 5 },
  { name: '胶片偏执者', date: '2025.04.21', body: '颗粒残像这一档我盯了很久,想问下 Tri-X 推到多少?谢谢。', rating: 4 },
  { name: '夜行者', date: '2025.04.14', body: '峡湾之晨的色温控制得太冷静了。推荐用做屏保。', rating: 5 },
  { name: 'Hannah L.', date: '2025.03.30', body: '留言墙能换便签颜色这件事,小孩很开心。', rating: 4 },
  { name: '阿松', date: '2025.03.22', body: '下一辑能不能去拍一次舟山?想去那边很久了。', rating: 3 },
  { name: '陆也', date: '2025.03.15', body: '主页大图裁剪到 30% 顶部很聪明,眼睛一下就到位。', rating: 5 },
  { name: '栗子茶', date: '2025.03.08', body: '雨天那组让我想学摄影,虽然大概会三天打鱼。', rating: 4 }
]

const notes = ref(SEED_NOTES.map(makeNote))

// 形式契约：MasonryGrid 接受 items + 触发 card-click
// 我们把 note 包装成统一 item,这样不需要改 MasonryGrid
const items = computed(() =>
  notes.value.map((n, idx) => ({
    id: n.id,
    width: 320,
    height: 220,
    _note: n,
    _index: idx
  }))
)

// 顶部表单
const formOpen = ref(false)
const draft = reactive({ name: '', body: '', rating: 0 })
const errors = reactive({ name: '', body: '' })

function openForm() {
  formOpen.value = true
}
function closeForm() {
  formOpen.value = false
  errors.name = ''
  errors.body = ''
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
  const newNote = makeNote({
    name: draft.name.trim(),
    body: draft.body.trim(),
    date: `${yyyy}.${mm}.${dd}`,
    rating: draft.rating
  })
  // 顶部插入,进入动画触发
  notes.value = [newNote, ...notes.value]
  // 重置
  draft.name = ''
  draft.body = ''
  draft.rating = 0
  errors.name = ''
  errors.body = ''
  formOpen.value = false
}

function setRating(n) {
  draft.rating = draft.rating === n ? 0 : n
}

// masonry 重排:把 MasonryGrid 的内部卡片高度交给 .note 自适应
// 我们让卡片宽度固定 ~320px、高度根据内容自然撑开 140 ~ 220
// MasonryGrid 已支持任意 height,把 height 字段改为可变量
const gridItems = computed(() =>
  items.value.map((it) => {
    const len = (it._note.body || '').length
    // 简单模型: 短 140, 中 180, 长 220
    let h = 160
    if (len > 60) h = 200
    if (len > 110) h = 240
    return { ...it, width: 320, height: h }
  })
)
</script>

<template>
  <section class="guestbook" aria-label="留言墙">
    <!-- 顶部栏:标题 + 计数 + 操作 -->
    <header class="guestbook__top">
      <div class="guestbook__title-wrap">
        <h1 class="guestbook__title">留言墙</h1>
        <span class="guestbook__title-en">Guestbook</span>
        <span class="guestbook__count">{{ notes.length }} 张便签</span>
      </div>

      <div class="guestbook__actions">
        <button
          type="button"
          class="guestbook__leave-btn"
          :aria-expanded="formOpen"
          aria-controls="guestbook-form"
          @click="openForm"
        >
          <span class="guestbook__leave-btn-dot" aria-hidden="true"></span>
          留下便签
        </button>
      </div>
    </header>

    <!-- 内联表单 -->
    <form
      v-if="formOpen"
      id="guestbook-form"
      class="guestbook__form"
      novalidate
      @submit.prevent="submitNote"
    >
      <div class="guestbook__form-row">
        <label class="guestbook__field">
          <span class="guestbook__field-label">昵称 / Nickname</span>
          <input
            v-model="draft.name"
            type="text"
            class="guestbook__input"
            :class="{ 'is-error': errors.name }"
            maxlength="32"
            autocomplete="off"
          />
          <span v-if="errors.name" class="guestbook__field-error">{{ errors.name }}</span>
        </label>

        <fieldset class="guestbook__field guestbook__stars-field">
          <legend class="guestbook__field-label">评价 / Rating (optional)</legend>
          <div class="guestbook__stars">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="guestbook__star"
              :class="{ 'is-on': draft.rating >= n }"
              :aria-pressed="draft.rating >= n"
              :aria-label="`${n} 星`"
              @click="setRating(n)"
            >★</button>
          </div>
        </fieldset>
      </div>

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

    <!-- 软木板 + 便签瀑布流(外裹木质边框) -->
    <div class="guestbook__frame" aria-label="留言列表">
      <section class="guestbook__board">
        <div v-if="notes.length === 0" class="guestbook__empty">
          <p>还没有便签。留下第一张吧。</p>
        </div>

        <MasonryGrid
          v-else
          :items="gridItems"
          :gap="28"
          :breakpoints="{ 0: 1, 600: 2, 900: 3, 1300: 4 }"
        >
          <template #default="{ item }">
            <article
              class="note"
              :style="{
                '--rotate': item._note.rotate + 'deg',
                '--enter-delay': item._note.enterDelay + 'ms',
                '--paper': item._note.color
              }"
            >
              <span class="note__pin" aria-hidden="true"></span>
              <header class="note__header">
                <span class="note__name">{{ item._note.name }}</span>
                <time class="note__date">{{ item._note.date }}</time>
              </header>
              <p class="note__body">{{ item._note.body }}</p>
              <footer v-if="item._note.rating > 0" class="note__rating" aria-label="评分">
                <span v-for="n in 5" :key="n" :class="{ 'is-on': item._note.rating >= n }">★</span>
              </footer>
            </article>
          </template>
        </MasonryGrid>
      </section>
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
  /* 占满主区可见高度,留出顶部栏位的视觉呼吸 */
  min-height: calc(100vh - var(--space-5) * 2);
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
  border-bottom: 1px solid var(--c-mist);
  margin-bottom: var(--space-6);
}

.guestbook__title-wrap {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.guestbook__title {
  font-family: var(--font-display);
  font-size: clamp(36px, 4.2vw, 56px);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--c-ink);
  margin: 0;
}

.guestbook__title-en {
  font-family: var(--font-hans);
  font-size: var(--fs-sm);
  font-weight: 400;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--c-mid);
}

.guestbook__count {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--c-mid);
  padding-left: var(--space-3);
  border-left: 1px solid var(--c-mist);
  margin-left: var(--space-2);
}

/* ====================================================================
   顶部操作按钮
==================================================================== */
.guestbook__leave-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  background: var(--c-ink);
  color: var(--c-bone);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  transition: background var(--t-base) var(--ease-out), transform var(--t-fast) var(--ease-out);
}

.guestbook__leave-btn:hover {
  background: #2a2a2a;
}

.guestbook__leave-btn:active {
  transform: translateY(1px);
}

.guestbook__leave-btn-dot {
  width: 6px;
  height: 6px;
  background: #d85a4a;
  display: inline-block;
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
  background: var(--c-bone);
  border: 1px solid var(--c-mist);
  animation: formIn var(--t-base) var(--ease-out) both;
}

@keyframes formIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.guestbook__form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

@media (max-width: 700px) {
  .guestbook__form-row {
    grid-template-columns: 1fr;
  }
}

.guestbook__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.guestbook__field--block {
  display: block;
}

.guestbook__field-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-mid);
}

.guestbook__input {
  width: 100%;
  padding: 10px 12px;
  background: var(--c-bone);
  border: 1px solid var(--c-mist);
  border-radius: 0;
  font-family: var(--font-body);
  font-size: var(--fs-base);
  font-weight: 400;
  color: var(--c-ink);
  outline: none;
  transition: border-color var(--t-base) var(--ease-out);
}

.guestbook__input:focus {
  border-color: var(--c-ink);
}

.guestbook__input.is-error {
  border-color: #b94740;
}

.guestbook__textarea {
  resize: vertical;
  min-height: 80px;
  font-family: var(--font-elegance);
  font-size: 15px;
  line-height: 1.6;
}

.guestbook__field-error {
  font-family: var(--font-mono);
  font-size: 11px;
  color: #b94740;
}

.guestbook__stars-field {
  border: 0;
  padding: 0;
  margin: 0;
}

.guestbook__stars-field legend {
  /* legend 不允许全局 margin,这里靠定位覆盖 */
  padding: 0 0 6px;
  width: 100%;
}

.guestbook__stars {
  display: inline-flex;
  gap: 6px;
}

.guestbook__star {
  width: 28px;
  height: 28px;
  border: 1px solid var(--c-mist);
  background: var(--c-bone);
  color: var(--c-soft);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: color var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out);
}

.guestbook__star.is-on {
  color: #c89b2c;
  border-color: #c89b2c;
}

.guestbook__form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.guestbook__btn {
  padding: 10px 22px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-radius: 0;
  cursor: pointer;
  border: 1px solid var(--c-ink);
  transition: background var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
}

.guestbook__btn--solid {
  background: var(--c-ink);
  color: var(--c-bone);
}

.guestbook__btn--solid:hover {
  background: #2a2a2a;
}

.guestbook__btn--ghost {
  background: transparent;
  color: var(--c-ink);
}

.guestbook__btn--ghost:hover {
  background: var(--c-mist);
}

/* ====================================================================
   软木板表面
   - 基色: #8B5A2B (warm brown)
   - 多层 radial-gradient 模拟木纹
   - 叠加 SVG 噪点作为颗粒
   - background-attachment: fixed 让滚动时背景静止 (按 brief)
==================================================================== */
/* 木质外框:
   - 4 个绝对定位的边缘条 + 4 个角块,通过线性渐变模拟木纹 + 内外倒角阴影
   - 厚度 ~22px,主体颜色取自截图:浅米色木 ( #d9b78b → #b07e4a ) + 微高光 + 暗缝阴影
   - 框架整体投影到页面上 (drop-shadow),内壁向软木板投阴影做"嵌入"感
==================================================================== */
.guestbook__frame {
  position: relative;
  flex: 1;
  display: block;
  padding: 22px;
  background:
    /* 内壁倒角:深凹槽一圈 */
    linear-gradient(#1a0e06, #1a0e06) padding-box,
    /* 木纹基色 + 暗角 + 微弱横向纹理 */
    linear-gradient(180deg, #e3c396 0%, #d2a877 35%, #b48457 70%, #8d5d34 100%) border-box;
  border: 0 solid transparent;
  box-shadow:
    0 18px 48px rgba(0, 0, 0, 0.22),
    0 4px 12px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 240, 210, 0.35),
    inset 0 -2px 6px rgba(0, 0, 0, 0.28);
}

/* 4 条木纹条幅:模拟拼接板 + 细纹理 */
.guestbook__frame::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      180deg,
      rgba(70, 40, 18, 0.10) 0,
      rgba(70, 40, 18, 0.10) 1px,
      transparent 1px,
      transparent 4px
    ),
    repeating-linear-gradient(
      180deg,
      rgba(255, 240, 210, 0.05) 0,
      rgba(255, 240, 210, 0.05) 1px,
      transparent 1px,
      transparent 9px
    );
}

/* 角落拼接缝:水平 + 垂直中线略深的接缝 */
.guestbook__frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    /* 顶部接缝 */
    linear-gradient(180deg, rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0) 2px),
    /* 底部接缝 */
    linear-gradient(0deg, rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0) 2px),
    /* 左侧接缝 */
    linear-gradient(90deg, rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0) 2px),
    /* 右侧接缝 */
    linear-gradient(270deg, rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0) 2px);
}

/* 软木板表面(在框内)
   - 真实软木板质感由 5 层叠加:
     1) 暖棕基色
     2) 几个大块不规则深棕色斑(径向渐变)
     3) 高密度小暗点(cork 颗粒) — radial-gradient 平铺
     4) 稀疏小亮点 — radial-gradient 平铺
     5) SVG turbulence 噪点(让边缘不齐) — ::before
     6) 边缘微暗角 — ::after
   - 颜色取自实际软木板图像:基色 #b48a5a,深斑 #6e4a25,亮点 #e8c896
==================================================================== */
.guestbook__board {
  position: relative;
  width: 100%;
  padding: 56px 32px 64px;
  background-color: #b48a5a;
  background-image:
    /* 大块不规则深棕斑(4 个) */
    radial-gradient(ellipse 520px 360px at 12% 18%, rgba(80, 45, 18, 0.28), transparent 70%),
    radial-gradient(ellipse 460px 320px at 88% 24%, rgba(60, 35, 14, 0.22), transparent 70%),
    radial-gradient(ellipse 600px 380px at 28% 82%, rgba(70, 40, 16, 0.26), transparent 70%),
    radial-gradient(ellipse 480px 340px at 92% 88%, rgba(80, 50, 22, 0.24), transparent 70%),
    /* 中等深色斑(补充 patchy 感) */
    radial-gradient(ellipse 280px 200px at 60% 12%, rgba(110, 70, 36, 0.18), transparent 75%),
    radial-gradient(ellipse 320px 220px at 8% 60%, rgba(110, 70, 36, 0.16), transparent 75%),
    radial-gradient(ellipse 260px 180px at 70% 70%, rgba(110, 70, 36, 0.18), transparent 75%),
    /* 高密度暗点: cork 颗粒的主体
       (radial-gradient 单点 + 小尺寸平铺,产生成千上万的点) */
    radial-gradient(circle at 50% 50%, rgba(50, 28, 10, 0.55) 0.6px, transparent 1.2px),
    /* 稀疏亮点:模拟 cork 表面的微高光 */
    radial-gradient(circle at 50% 50%, rgba(255, 235, 200, 0.45) 0.5px, transparent 1.0px),
    /* 整体基础径向:让中心略亮、四角略暗(进一步强化 cork 的微反射) */
    radial-gradient(ellipse at center, rgba(255, 230, 195, 0.10), transparent 65%);
  background-size:
    auto, auto, auto, auto,
    auto, auto, auto,
    7px 7px,
    13px 13px,
    auto;
  background-position:
    0 0, 0 0, 0 0, 0 0,
    0 0, 0 0, 0 0,
    0 0,
    3px 4px,
    0 0;
  background-repeat:
    no-repeat, no-repeat, no-repeat, no-repeat,
    no-repeat, no-repeat, no-repeat,
    repeat,
    repeat,
    no-repeat;
  background-attachment: local, local, local, local, local, local, local, local, local, local;
  box-shadow:
    inset 0 6px 18px rgba(0, 0, 0, 0.45),
    inset 0 -3px 12px rgba(0, 0, 0, 0.35),
    inset 4px 0 14px rgba(0, 0, 0, 0.28),
    inset -4px 0 14px rgba(0, 0, 0, 0.28);
}

/* 颗粒不齐感:SVG turbulence,让点阵的"死板网格"被打破 */
.guestbook__board::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.20  0 0 0 0 0.12  0 0 0 0 0.05  0 0 0 0.42 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.55;
  mix-blend-mode: multiply;
}

/* 暗角:让软木板在木框内显得"沉下去" */
.guestbook__board::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.28) 100%);
}

/* 空状态 */
.guestbook__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  color: rgba(255, 250, 240, 0.86);
}

/* ====================================================================
   便签 (.note)
   - 通过 CSS 变量接住随机色与旋转
   - :hover 上浮 + 阴影加深 + 轻微增大旋转 (brief 方案一)
   - 顶部图钉 ::before
==================================================================== */
.note {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px 22px 18px;
  width: 100%;
  height: 100%;
  background: var(--paper, #FFFA9E);
  color: #333333;
  font-family: var(--font-elegance);
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.18);
  transform-origin: 50% 0%;
  transform: rotate(var(--rotate, 0deg));
  transition:
    transform var(--t-base) var(--ease-out),
    box-shadow var(--t-base) var(--ease-out);
  animation: noteIn 0.55s var(--ease-out) both;
  animation-delay: var(--enter-delay, 0ms);
}

@keyframes noteIn {
  from {
    opacity: 0;
    transform: rotate(calc(var(--rotate, 0deg) - 6deg)) translateY(-10px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: rotate(var(--rotate, 0deg)) translateY(0) scale(1);
  }
}

/* 图钉 */
.note__pin {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #e88a82, #b94740 65%, #7a2419);
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.35),
    inset -1px -1px 1px rgba(0, 0, 0, 0.25),
    inset 1px 1px 1px rgba(255, 255, 255, 0.35);
}
.note__pin::after {
  /* 高光小点 */
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
}

.note__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.note__name {
  font-family: var(--font-elegance);
  font-size: 16px;
  font-weight: 700;
  color: #111111;
  letter-spacing: 0.01em;
}

.note__date {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 400;
  color: #888888;
  letter-spacing: 0.06em;
}

.note__body {
  flex: 1;
  margin: 0;
  font-family: var(--font-elegance);
  font-size: 14.5px;
  line-height: 1.55;
  color: #333333;
  word-break: break-word;
}

.note__rating {
  display: inline-flex;
  gap: 2px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: rgba(120, 90, 20, 0.35);
}

.note__rating span.is-on {
  color: #c89b2c;
}

/* 悬浮:方案一 (上浮 + 阴影 + 角度 +3deg) */
.note:hover {
  transform: rotate(calc(var(--rotate, 0deg) + 3deg)) translateY(-6px) scale(1.02);
  box-shadow: 6px 12px 20px rgba(0, 0, 0, 0.28);
  z-index: 2;
}

.note:focus-within {
  transform: rotate(calc(var(--rotate, 0deg) + 3deg)) translateY(-6px) scale(1.02);
  box-shadow: 6px 12px 20px rgba(0, 0, 0, 0.28);
  z-index: 2;
}

/* ====================================================================
   减弱动效:用户偏好 prefers-reduced-motion
==================================================================== */
@media (prefers-reduced-motion: reduce) {
  .note,
  .guestbook__form {
    animation: none !important;
    transition: none !important;
  }
  .note:hover {
    transform: rotate(var(--rotate, 0deg));
  }
}
</style>