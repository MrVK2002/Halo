# MrVK Photography

一个极简风格的个人摄影作品集网站，使用 **Vue 3 + Vite** 构建。

站点以「左侧菜单 + 右侧作品区」的编辑式排版呈现，包含瀑布流作品展示、灯箱预览、About、Contact 与 Guestbook 页面，并适配桌面与移动端。

## 功能特性

- **瀑布流作品集**：按分类筛选（全部 / 帧率之外 / 曝光日志 / 冗余像素及子分类），列数随窗口宽度自适应。
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

需要 **Node.js ≥ 18**。

## 目录结构

```
src/
├── components/     页面与交互组件（瀑布流、灯箱、菜单、About、Contact、Guestbook 等）
├── composables/    照片筛选、平滑滚动、灯箱状态
├── data/           摄影作品与 EXIF 数据
├── assets/         设计变量、样式重置与本地字体
└── views/          主页视图装配
```

## 内容维护

- 作品图片与分类在 `src/data/photos.js` 中维护，替换 `photoId` 即可更换图片。
- Contact 页面中的文案与联系方式为演示内容，正式使用前请替换为真实信息。
- Guestbook 目前为前端内存数据，刷新后恢复初始留言。

## License

代码以 MIT 协议开源。图片版权归各自摄影师所有，遵循 [Unsplash License](https://unsplash.com/license)。
