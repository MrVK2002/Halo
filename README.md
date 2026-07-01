# MrVK Photography

一个使用 **Vue 3 + Vite** 实现的极简风格个人摄影作品集网站。布局与交互严格遵循 `个人摄影网站布局.txt` 设计稿。瀑布流照片支持 3D 拾起悬浮交互效果,侧栏菜单、About、Guestbook 三个模块共享同一套设计 token。

## 设计取向

- **Design read**: solo photographer portfolio, minimalist editorial language, leaning toward native CSS + Lenis-driven scroll + Masonry + GSAP micro-interactions.
- **三轴拨盘**:`VARIANCE = 5 / MOTION = 4 / DENSITY = 3`。
- **配色**(严格沿用 brief):`#111` `#888` `#CCC` `#DDD` `#FFF`,全局零圆角(About / Guestbook 局部例外)。
- **字体**:Newsreader (display) + Inter Tight (body) + JetBrains Mono (数字标签)+ HFSimpleElegance / SourceHanSansSC / ArtierEN / Aidian-SignatureTi(本地字体,按模块调用)。
- **动效**:Lenis 阻尼滚动 + GSAP timeline / spring + 照片 hover 3D 拾起 + 骨架屏 shimmer + 瓦片铺开 + PhotoSwipe 缩略图放大 + 表单展开过渡 + 减弱动效兜底。

## 功能模块

| 模块 | 入口 | 文件 | 状态 |
| --- | --- | --- | --- |
| 瀑布流作品集 | 左侧菜单 — `All` / `Frame` / `Exposure` / `Pixels` | `MasonryGrid` / `PhotoCard` / `Lightbox` | ✅ |
| About Me | 左侧菜单 — `About Me` | `AboutSection` + `TiltedCard` | ✅ |
| Contact | 左侧菜单 — `Contact` | `HomeView` 内联占位 | 🟡 占位("联系 / 约拍入口即将开放") |
| Guestbook 留言墙 | 左侧菜单 — `Guestbook` | `GuestbookSection` | ✅(本地内存,刷新即失) |

## 启动

```bash
npm install
npm run dev       # http://127.0.0.1:5173
npm run build     # 输出到 dist/
npm run preview   # http://127.0.0.1:4173
```

要求 **Node.js ≥ 18**。

## 依赖

| 包 | 版本 | 用途 |
| --- | --- | --- |
| `vue` | ^3.5.13 | 框架 |
| `lenis` | ^1.3.4 | 阻尼滚动(尊重 `prefers-reduced-motion`) |
| `gsap` | ^3.15.0 | 时间线动画、spring 拾起、字符级 stagger |
| `motion` | ^12.42.0 | 轻量补间(备用) |
| `vue-waterfall-plugin-next` | ^3.0.1 | 瀑布流容器(懒加载 + 列数响应式) |
| `vite` | ^6.0.7 | 构建工具 |
| `@vitejs/plugin-vue` | ^5.2.1 | Vue SFC 支持 |

## 目录结构

```
src/
├── main.js                                入口
├── App.vue                                根组件 (装 HomeView)
├── assets/
│   ├── styles/
│   │   ├── tokens.css                     设计 token (颜色/字体/间距/缓动/本地 @font-face)
│   │   └── reset.css                      极简 reset
│   └── font/
│       ├── HFSimpleElegance-2.ttf         优雅衬线(中文标题备选)
│       ├── SourceHanSansSC-VF.ttf         思源黑可变字重
│       ├── ArtierEN-2.ttf                 装饰英文 Logo
│       ├── Aidian-SignatureTi.ttf         手写签名(About 标题)
│       └── XianSheng-GaiZenMeChengNi-2.ttf 备用中文
├── composables/
│   ├── usePhotos.js                       分类筛选 + 转 Masonry items
│   ├── useSmoothScroll.js                 Lenis 阻尼滚动 (尊重 reduced-motion)
│   └── useLightbox.js                     PhotoSwipe 实例管理 + EXIF 注入
├── data/
│   └── photos.js                          50+ 张摄影 + 完整 EXIF + 3 主分类 / 3 子分类
├── components/
│   ├── SideMenu.vue                       左侧 18% 菜单 (GSAP timeline + hover bar)
│   ├── MenuItem.vue                       单个菜单项 (透明背景 / 竖线激活态)
│   ├── SocialIcons.vue                    社交图标 (Instagram / 小红书 / X / 抖音)
│   ├── MasonryGrid.vue                    瀑布流容器 (vue-waterfall-plugin-next)
│   ├── PhotoCard.vue                      照片卡片 (骨架屏 + 瓦片铺开 + hover)
│   ├── Lightbox.vue                       灯箱 (PhotoSwipe v5 + EXIF 信息栏)
│   ├── TiltedCard.vue                     通用 3D 拾起卡片 (GSAP spring)
│   ├── AboutSection.vue                   About Me 页(肖像 + 简介 + GSAP 入场)
│   └── GuestbookSection.vue               留言墙(种子数据 + 表单 + 卡片网格)
└── views/
    └── HomeView.vue                       主页装配(根据 activeCategory 切换视图)
```

## 关键交互细节

### 通用 / 导航

| 模块 | 实现 |
| --- | --- |
| 左侧菜单 | `position: sticky` + 独立原生滚动,与右侧 Lenis 互不干扰 |
| Logo 入场 | `rotationX(-90) + y:40 + stagger 0.03` 字符级 3D 翻转 |
| 菜单激活态 | 左侧 2px 竖线 (`::before` 伪元素 width 过渡) |
| 菜单 hover | 共享 `hover-bar` 跟随鼠标位置平滑滑动(GSAP `power2.out`) |
| 章节标题 | 字符级 stagger 淡入(`y:20 opacity:0`) |
| 阻尼滚动 | Lenis `lerp: 0.1`,`wheelMultiplier: 1`,自动尊重 `reduced-motion` |

### 瀑布流

| 模块 | 实现 |
| --- | --- |
| 瀑布流容器 | `vue-waterfall-plugin-next` 自适应列数 (2~5 列),`ResizeObserver` 触发重排 |
| 骨架屏 | `linear-gradient` 横向移动 shimmer 动画,直角矩形 |
| 瓦片铺开 | `scale(0.96) opacity(0) → scale(1) opacity(1)`,stagger 40ms |
| 照片 hover | `PhotoCard` 内置传统缩放阴影;`TiltedCard` 提供 GSAP spring 3D 拾起(About 页用) |

### 3D 拾起悬浮(`TiltedCard.vue`)

- 鼠标跟踪计算 `rotateX / rotateY(±amplitude)`
- **GSAP ticker + 手动 spring**:`target.val += (current - target.val) * 0.06` 实现迟钝的弹性跟随
- hover 缩放 + 高光层 + 双层投影
- 离场 `power2.out / duration: 1.2s` 平滑归位
- 入场自带 `grayscale(100%) blur(16px) → 0` 的「失焦渐清」动效

### About 页

- 左右两栏:左侧 `TiltedCard` 肖像(微旋转容器 + 硬阴影),右侧姓名/副标题/简介/社交图标
- GSAP timeline:姓名两行 `y:100% → 0`、副标题/简介/图标依次淡入
- 标题字体:Aidian-SignatureTi(本地手写体),签名感

### Guestbook 留言墙(`GuestbookSection.vue`)

- **顶部栏**:中英标题 + 实时计数 + 「留下足迹」按钮(`+ → −` 旋转动画由 `aria-expanded` 驱动)
- **内联表单**:Vue `<Transition>` 实现展开收起(同步过渡 `opacity / transform / max-height / padding`),字段长度限制(昵称 32、留言 280),空字段校验 + 行内错误信息
- **种子数据**:`SEED_NOTES` 预置 9 条留言,作为初始展示
- **新增留言**:生成 `id = n-{Date.now()}-{rand}`、当日日期 `yyyy.mm.dd`,**插入列表头部**
- **卡片网格**:CSS Grid 4 列 + `grid-auto-flow: dense`,根据 `index % 5 / % 7` 自动给部分卡片加 `--tall / --wide` 修饰类;`--featured` 标记由种子数据决定
- **响应式断点**:1200 / 900 / 480 px,移动端退化为单列 + 卡片统一尺寸
- **减弱动效**:`prefers-reduced-motion: reduce` 关闭表单 / 卡片 hover / 按钮的所有过渡

### 灯箱

| 模块 | 实现 |
| --- | --- |
| 灯箱组件 | PhotoSwipe v5,`zoom` 动画从缩略图起点放大 |
| 灯箱信息栏 | `addCaptionHTMLFn` 自定义,标题 + EXIF 字段(相机/光圈/快门/ISO/日期) |

## 配色 / 字体 / 间距变量

定义在 `src/assets/styles/tokens.css`,**所有组件统一引用**:

```css
/* 配色 */
--c-ink:    #111111  /* 主文字、强调 */
--c-mid:    #888888  /* 次要文字、边框 */
--c-soft:   #cccccc  /* 普通文字、默认菜单 */
--c-mist:   #dddddd  /* 背景、悬浮、骨架底 */
--c-bone:   #ffffff  /* 主背景 */
--c-shimmer-from: #e0e0e0
--c-shimmer-to:   #f0f0f0

/* 字体 */
--font-display:  'Newsreader', Georgia, 'Songti SC', serif;
--font-body:     'Inter Tight', ..., 'PingFang SC', sans-serif;
--font-mono:     'JetBrains Mono', ui-monospace, ...;
--font-elegance: 'HFSimpleElegance-2', 'Songti SC', ...;
--font-hans:     'SourceHanSansSC-VF', 'Noto Sans SC', ...;
--font-artier:   'ArtierEN-2', 'Didot', ...;

/* 字号 */   --fs-xs..--fs-display
/* 间距 */   --space-1 (4px) .. --space-8 (64px)
/* 缓动 */   --ease-out / --ease-soft / --t-fast / --t-base / --t-slow
/* 布局 */   --layout-min-width: 1200px; --side-width: 18%; --main-width: 82%
```

## 路由 / 视图切换

无 `vue-router`,通过 `usePhotos()` 暴露的 `activeCategory` 状态做 **条件渲染**:

```
all / frame / frame.narrative / exposure / exposure.available-light / pixels / pixels.grain
  └─→ <MasonryGrid>

about      └─→ <AboutSection>
guestbook  └─→ <GuestbookSection>
contact    └─→ <p>占位提示</p>  (setCategory('all') 兜底)
```

`SideMenu` 头部 logo 点击 → 回到 `all`。

## 数据结构

### 摄影数据(`src/data/photos.js`)

```js
{
  id: 'p01',
  category: 'frame',                    // 主分类
  subcategory: 'frame.narrative',       // 子分类(可选,用于二级筛选)
  photoId: '1500648767791-00dcc994a43e', // Unsplash photo ID
  title: '窗边午后',
  width: 1200, height: 1500,            // Masonry 占位计算
  exif: { camera, aperture, shutter, iso, date }
}
```

`unsplashUrl(photoId, { width, quality })` 自动构造 `https://images.unsplash.com/photo-{id}?w=...&q=...&auto=format&fit=crop`。

> 要换图:只替换 `photoId` 即可;EXIF 为模拟数据,可与图无关。

### 分类清单

```js
[
  { key: 'all',                       labelCN: '全部' },
  { key: 'frame',                     labelCN: '帧率之外' },
  { key: 'frame.narrative',           labelCN: '叙事瞬间' },
  { key: 'exposure',                  labelCN: '曝光日志' },
  { key: 'exposure.available-light',  labelCN: '可用光' },
  { key: 'pixels',                    labelCN: '冗余像素' },
  { key: 'pixels.grain',              labelCN: '颗粒残像' }
]
```

### Guestbook 留言

```js
{
  id: 'n-{timestamp}-{rand}',          // 提交时自动生成
  name: 'Iris Wen',
  date: '2025.05.12',                  // yyyy.mm.dd
  body: '夜街那组太有氛围感了...',
  featured: true                       // 决定是否占 2x2 大卡
}
```

## 设计决策记录

- **Masonry 库选型**:`vue-waterfall-plugin-next` 是 Vue 3 专用瀑布流组件,内置列数响应式 + 懒加载,避免自己写 `ResizeObserver` + 高度测量。
- **Lightbox 库选型**:PhotoSwipe v5 是当前事实标准,EXIF 与缩略图放大开箱即用,MIT。
- **动效用 GSAP 而非 motion**:时间线编排、字符 stagger、spring ticker 都需要 GSAP 的 timeline / ticker API,`motion` 仅作为备用。
- **3D 拾起抽到独立组件**:`TiltedCard.vue` 是通用容器,About 页肖像用 `rotateAmplitude: 2` 的轻度版,后续如需卡片化作品集可直接复用。
- **不用 Tailwind/UnoCSS**:Vue SFC `<style scoped>` 配合 CSS 变量,符合 minimalist-skill 协议,减少学习与配置成本。
- **图标手写 SVG**:只画了 4 个社交图标路径,避免引入 phosphor 图标包的多余依赖。
- **图片外链而非打包**:Unsplash CDN 全球缓存,首屏 800w 缩略图约 30~60KB,符合性能预算。
- **无路由库**:视图切换只 4 种状态,`v-if` 条件渲染足够,引入 vue-router 反而增加心智负担。
- **Guestbook 不持久化**:MVP 阶段先用内存数组,接后端时只需把 `submitNote` 里的 push 换成 fetch 即可。

## 不在 MVP 范围内(后续可加)

- Guestbook 真实后端 / 持久化(目前刷新即失,留言仅在内存数组)
- 暗色模式(brief 已是"深字白底"基调)
- 移动端响应式(brief 写明 `min-width: 1200px`,Guestbook 已写好移动端样式但全站未启用)
- 真实联系页(邮件表单 / 微信二维码)
- 多语言切换(目前 About 简介英文 + Guestbook 中文,混合展示)

## License

代码本身 MIT。图片版权归各自 Unsplash 摄影师所有,遵循 [Unsplash License](https://unsplash.com/license)。