# MrVK Photography

一个极简风格的个人摄影作品集网站，使用 **Vue 3 + Vite** 构建。

站点以「左侧菜单 + 右侧作品区」的编辑式排版呈现，包含瀑布流作品展示、灯箱预览、About、Contact 与 Guestbook 页面，并适配桌面与移动端。

## 功能特性

- **瀑布流作品集**：6 个相互独立的作品集（帧率之外 / 叙事瞬间 / 曝光日志 / 可用光 / 冗余像素 / 颗粒残像），每张照片只归属一个作品集；「全部」按作品集交错排列，列数随窗口宽度自适应。
- **加载策略**：「全部」一次性展示所有作品；单个作品集按 9 张/批滚动加载。图片未就绪时先显示高斯模糊占位图，加载完成后平滑淡入。
- **灯箱预览**：点击照片放大查看，支持键盘方向键、触屏滑动切换，并展示作品标题与 EXIF 信息。
- **About**：Polaroid 风格肖像卡片与个人简介。
- **Contact**：左右分栏的联系页面，包含邮箱、电话等联系方式。
- **Guestbook**：留言墙，可提交昵称与留言，卡片错落排布。
- **移动端适配**：小屏自动切换为顶部导航 + 抽屉菜单。
- **细节动效**：阻尼滚动、入场动画、照片悬停 3D 抬起与自定义光标，并尊重系统的「减少动态效果」设置。

## 技术栈

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/)
- [GSAP](https://gsap.com/)（动画）
- [Lenis](https://github.com/darkroomengineering/lenis)（平滑滚动）
- 原生 CSS 变量 + Scoped CSS，无 UI 框架、无路由库

## 快速开始

```bash
npm install
npm run dev       # 本地开发
npm run build     # 构建到 dist/
npm run preview   # 预览构建结果
```

需要 **Node.js ≥ 18**（推荐 20 LTS）。若使用 nvm 管理多版本，先执行 `nvm use 20.18.0`，否则 `npm run images` 与 `npm run build` 会因 Node 版本过低失败。

## 目录结构

```
src/
├── components/     页面与交互组件（瀑布流、灯箱、菜单、About、Contact、Guestbook 等）
├── composables/    照片筛选与交错排序、平滑滚动、灯箱状态
├── data/           摄影作品、EXIF 与占位图数据
├── assets/         设计变量、样式重置与本地字体
└── views/          主页视图装配
scripts/
└── generate-images.mjs   批量生成 WebP 与模糊占位图
public/images/
├── portfolio/            作品原图（按 frame / exposure / pixels 目录存放）
└── portfolio-optimized/  生成的 400 / 800 / 1600 三档 WebP
```

## 内容维护

### 作品集划分

作品集定义在 `src/data/photos.js` 的 `PHOTO_CATEGORIES`，共 6 个独立作品集，无子分类概念：

| key | 名称 | 说明 |
|---|---|---|
| `frame` | Beyond the Frame Rate 帧率之外 | 人像 / 造型 |
| `narrative` | Narrative Frames 叙事瞬间 | 人物瞬间 / 动势叙事 |
| `exposure` | Exposure Log 曝光日志 | 户外与场景 |
| `available-light` | Available Light 可用光 | 自然光、静物、风光 |
| `pixels` | Redundant Pixels 冗余像素 | 建筑与城市 |
| `grain` | Grain Residue 颗粒残像 | 夜景、霓虹、抽象颗粒 |

`all` 为聚合视图（不参与照片归属），点击侧边栏 Logo 即回到该视图。

### 新增作品

1. 把原图（png / jpg / jpeg / webp）放入 `public/images/portfolio/{frame|exposure|pixels}/` 任意子目录；
2. 执行 `npm run images`：在 `public/images/portfolio-optimized/` 生成 400 / 800 / 1600 三档 WebP，并刷新 `src/data/photo-placeholders.json` 中的模糊占位图；
3. 在 `src/data/photos.js` 的 `PHOTOS` 中登记一条数据；
4. 刷新页面即可看到，无需手动压缩或改路径。

注意：
- 文件名会转成 slug（小写、非字母数字转连字符），**同名文件会互相覆盖**，重名请改名（例如 `xxx-2.png`）；
- 图片目录只决定文件存放位置，作品归属由数据里的 `category` 决定，两者解耦；
- 每张照片只能属于一个作品集，避免同一张图出现在多个作品集。

### 数据字段

```js
{
  id: 'p01',                 // 唯一标识，Lightbox 与动画 key 使用
  category: 'narrative',     // 归属作品集 key
  title: '专注时刻',          // 中文标题，卡片 alt 与灯箱标题
  width: 908, height: 1200,  // 原图宽高，用于瀑布流占位比例
  img: localImages('frame', 'analyst-at-work'), // 目录名 + slug，与 category 解耦
  exif: { camera, aperture, shutter, iso, date } // 灯箱展示的拍摄参数
}
```

### 其他

- Contact 页面中的文案与联系方式为演示内容，正式使用前请替换为真实信息。
- Guestbook 目前为前端内存数据，刷新后恢复初始留言。

## License

代码以 MIT 协议开源。站内摄影作品版权归作者所有。
