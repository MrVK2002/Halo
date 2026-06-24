# MrVK Photography

一个使用 Vue 3 + Vite 实现的极简风格个人摄影作品集网站。布局与交互严格遵循 `个人摄影网站布局.txt` 设计稿。瀑布流照片支持 3D 拾起悬浮交互效果。

## 设计取向

- **Design read**: solo photographer portfolio, minimalist editorial language, leaning toward native CSS + Lenis-driven scroll + Masonry.
- **三轴拨盘**:`VARIANCE = 5 / MOTION = 4 / DENSITY = 3`。
- **配色**(严格沿用 brief):`#111` `#888` `#CCC` `#DDD` `#FFF`,全局零圆角。
- **字体**:Newsreader (display) + Inter Tight (body) + JetBrains Mono (数字标签)。
- **动效**:全程 Lenis 阻尼滚动 + 照片 hover 缩放阴影 + 骨架屏 shimmer + 瓦片铺开 + PhotoSwipe 缩略图放大,克制到 4 个。

## 启动

```bash
npm install
npm run dev       # http://127.0.0.1:5173
npm run build     # 输出到 dist/
npm run preview   # 预览生产包
```

要求 Node.js ≥ 18。

## 目录结构

```
src/
├── main.js                       入口
├── App.vue                       根组件 (装 HomeView)
├── assets/styles/
│   ├── tokens.css                设计 token (颜色/字体/间距/缓动)
│   └── reset.css                 极简 reset
├── composables/
│   ├── usePhotos.js              分类筛选 + 转 Masonry items
│   ├── useSmoothScroll.js        Lenis 阻尼滚动 (尊重 reduced-motion)
│   └── useLightbox.js            PhotoSwipe 实例管理 + EXIF 注入
├── data/
│   └── photos.js                 24 张真实摄影 + EXIF 元数据
├── components/
│   ├── SideMenu.vue              左侧 30% 菜单
│   ├── MenuItem.vue              单个菜单项 (透明背景/竖线激活态)
│   ├── SocialIcons.vue           社交图标 (Instagram/小红书/X/抖音)
│   ├── MasonryGrid.vue           瀑布流容器 (vue-waterfall-plugin-next)
│   ├── WaterfallCard.vue         瀑布流卡片 (3D 拾起悬浮效果)
│   ├── PhotoCard.vue             照片卡片 (骨架屏 + 瓦片铺开 + hover)
│   └── Lightbox.vue              灯箱 (PhotoSwipe v5 + EXIF 信息栏)
└── views/
    └── HomeView.vue              主页装配
```

## 关键交互细节

| 模块 | 实现 |
| --- | --- |
| 左侧菜单 | `position: sticky` + 独立原生滚动,与右侧 Lenis 互不干扰 |
| 菜单激活态 | 左侧 2px 竖线 (`::before` 伪元素 width 过渡) |
| 菜单 hover | 文字色 `#888 → #111`,竖线由 0 → 2px |
| 瀑布流 | `vue-waterfall-plugin-next` 自适应列数 (2~5 列),`ResizeObserver` 触发重排 |
| 骨架屏 | `linear-gradient` 横向移动 shimmer 动画,直角矩形 |
| 瓦片铺开 | `scale(0.96) opacity(0) → scale(1) opacity(1)`,stagger 40ms |
| 3D 拾起悬浮 | 鼠标跟踪倾斜 `rotateX/rotateY(±9deg)` + `translateZ(20px)` + `scale(1.06)` + 高光层 + 双层投影,弹性缓动曲线 |
| Hover 照片 | 3D 拾起悬浮效果替代传统缩放阴影 |
| 阻尼滚动 | Lenis `lerp: 0.1`,`wheelMultiplier: 1` |
| 灯箱 | PhotoSwipe v5,`zoom` 动画从缩略图起点放大 |
| 灯箱信息栏 | `addCaptionHTMLFn` 自定义,标题 + EXIF 字段 |

## 配色变量

```css
--c-ink:   #111111  /* 主文字、强调 */
--c-mid:   #888888  /* 次要文字、边框 */
--c-soft:  #cccccc  /* 普通文字、默认菜单 */
--c-mist:  #dddddd  /* 背景、悬浮、骨架底 */
--c-bone:  #ffffff  /* 主背景 */
```

## 图片替换

`src/data/photos.js` 是唯一的图片来源:

```js
{
  id: 'p01',
  category: 'portrait',                       // portrait | landscape | street | documentary
  photoId: '1500648767791-00dcc994a43e',      // Unsplash photo ID (URL 中 photo- 后的部分)
  title: '窗边午后',
  width: 1200, height: 1500,                  // 用于 Masonry 计算占位
  exif: { camera, aperture, shutter, iso, date }
}
```

`unsplashUrl(photoId, { width, quality })` 自动构造 `https://images.unsplash.com/photo-{id}?w=...&q=...`。

要换图:替换 `photoId` 即可。其余元数据为模拟数据,可与图无关。

## 不在 MVP 范围内 (后续可加)

- 留言墙 (软木板背景 + 翻页便签) — 计划文件已设计
- 关于摄影师 / 联系页内容
- 暗色模式 (brief 已是"深字白底"基调)
- 移动端响应式 (brief 写明 `min-width: 1200px`)
- 真实留言后端 / 持久化
- 暗色模式 / 多语言
- 暗色调菜单
- 真实联系页 (邮件表单 / 微信二维码)
- 移动端断点 (lenis 在触屏可用,但 masonry 列数策略需要重写)

## 设计决策记录

- **Masonry 库选型**:`vue-waterfall-plugin-next` 是 Vue 3 专用瀑布流组件,支持懒加载和动画,内置列数响应式。`WaterfallCard.vue` 封装卡片交互逻辑,解决与 Vue 3.5+ 的兼容性问题。
- **Lightbox 库选型**:PhotoSwipe v5 是当前事实标准,EXIF 与缩略图放大开箱即用,MIT。
- **不用 Tailwind/UnoCSS**:Vue SFC `<style scoped>` 配合 CSS 变量,符合 `minimalist-skill` 协议 2,减少学习与配置成本。
- **图标手写 SVG**:只画了 4 个社交图标路径,代码量极小,避免引入 phosphor 图标包的多余依赖。
- **图片外链而非打包**:Unsplash CDN 全球缓存,首屏 800w 缩略图约 30~60KB,符合性能预算。

## License

代码本身 MIT。图片版权归各自 Unsplash 摄影师所有,遵循 [Unsplash License](https://unsplash.com/license)。
