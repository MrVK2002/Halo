/**
 * 摄影作品数据
 * - 原图位于 public/images/portfolio，页面使用 public/images/portfolio-optimized 下的 WebP
 * - 3 个主分类 + 3 个子分类，合计 13 张
 * - 每张带完整 EXIF 元数据（Lightbox 内展示）
 */
import placeholders from './photo-placeholders.json'

const PHOTO_CATEGORIES = [
  { key: 'all', labelEN: 'All', labelCN: '全部' },
  { key: 'frame', labelEN: 'Beyond the Frame Rate', labelCN: '帧率之外' },
  { key: 'frame.narrative', labelEN: 'Narrative Frames', labelCN: '叙事瞬间' },
  { key: 'exposure', labelEN: 'Exposure Log', labelCN: '曝光日志' },
  { key: 'exposure.available-light', labelEN: 'Available Light', labelCN: '可用光' },
  { key: 'pixels', labelEN: 'Redundant Pixels', labelCN: '冗余像素' },
  { key: 'pixels.grain', labelEN: 'Grain Residue', labelCN: '颗粒残像' }
]

/** 生成本地图片三档路径（指向独立的优化目录，原图目录只放源文件） */
function localImages(category, slug) {
  const base = `/images/portfolio-optimized/${category}/${slug}`
  return {
    thumb: `${base}-400.webp`,
    display: `${base}-800.webp`,
    full: `${base}-1600.webp`,
    placeholder: placeholders[`${category}/${slug}`] || ''
  }
}

const PHOTOS = [
  // ===== Beyond the Frame Rate 帧率之外 =====
  {
    id: 'p01',
    category: 'frame',
    subcategory: 'frame.narrative',
    title: '专注时刻',
    width: 908, height: 1200,
    img: localImages('frame', 'analyst-at-work'),
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/2.0', shutter: '1/160s', iso: 'ISO 800', date: '2025.06.12' }
  },
  {
    id: 'p02',
    category: 'frame',
    subcategory: 'frame.narrative',
    title: '流动的肖像',
    width: 960, height: 1200,
    img: localImages('frame', 'dynamic-woman-portrait'),
    exif: { camera: 'Canon R5 / 85mm F1.2', aperture: 'F/1.8', shutter: '1/250s', iso: 'ISO 400', date: '2025.05.28' }
  },
  {
    id: 'p03',
    category: 'frame',
    title: '花间肖像',
    width: 960, height: 1200,
    img: localImages('frame', 'floral-portrait-harmony'),
    exif: { camera: 'Fuji X-T5 / 56mm F1.2', aperture: 'F/1.4', shutter: '1/500s', iso: 'ISO 200', date: '2025.05.10' }
  },

  // ===== Exposure Log 曝光日志 =====
  {
    id: 'p04',
    category: 'exposure',
    title: '海岸老爷车',
    width: 840, height: 1200,
    img: localImages('exposure', 'classic-car-by-the-coast'),
    exif: { camera: 'Leica Q3 / 28mm', aperture: 'F/8.0', shutter: '1/500s', iso: 'ISO 100', date: '2025.04.22' }
  },
  {
    id: 'p05',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    title: '山丘之上',
    width: 900, height: 1200,
    img: localImages('exposure', 'modern-hilltop-structure'),
    exif: { camera: 'Sony A7R5 / 16-35mm F2.8', aperture: 'F/8.0', shutter: '1/250s', iso: 'ISO 100', date: '2025.04.05' }
  },
  {
    id: 'p06',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    title: '火山渣锥',
    width: 1200, height: 800,
    img: localImages('exposure', 'volcanic-cinder-cone'),
    exif: { camera: 'Nikon Z8 / 70-200mm F2.8', aperture: 'F/11', shutter: '1/320s', iso: 'ISO 100', date: '2025.03.18' }
  },

  // ===== Redundant Pixels 冗余像素 =====
  {
    id: 'p07',
    category: 'pixels',
    subcategory: 'pixels.grain',
    title: '城市喧嚣',
    width: 904, height: 1200,
    img: localImages('pixels', 'man-in-urban-chaos'),
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/2.8', shutter: '1/125s', iso: 'ISO 1600', date: '2025.03.02' }
  },
  {
    id: 'p08',
    category: 'pixels',
    subcategory: 'pixels.grain',
    title: '暮色建筑',
    width: 1200, height: 686,
    img: localImages('pixels', 'modern-architectural-elegance-at-twilight'),
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/5.6', shutter: '1/125s', iso: 'ISO 400', date: '2025.02.14' }
  },
  {
    id: 'p09',
    category: 'pixels',
    title: '建筑的秩序',
    width: 1200, height: 687,
    img: localImages('pixels', 'modern-architectural-elegance'),
    exif: { camera: 'Leica SL2 / 24-90mm F2.8', aperture: 'F/8.0', shutter: '1/320s', iso: 'ISO 100', date: '2025.02.01' }
  },
  {
    id: 'p10',
    category: 'pixels',
    title: '结构之美',
    width: 670, height: 1199,
    img: localImages('pixels', 'modern-architectural-structure'),
    exif: { camera: 'Canon R5 / 24mm F1.4', aperture: 'F/8.0', shutter: '1/250s', iso: 'ISO 100', date: '2025.01.20' }
  },
  {
    id: 'p11',
    category: 'pixels',
    title: '悬挑住宅',
    width: 800, height: 1200,
    img: localImages('pixels', 'modern-cantilevered-house'),
    exif: { camera: 'Fuji GFX 100 / 32-64mm F4', aperture: 'F/8.0', shutter: '1/200s', iso: 'ISO 100', date: '2025.01.08' }
  },
  {
    id: 'p12',
    category: 'pixels',
    title: '极简立面',
    width: 904, height: 1200,
    img: localImages('pixels', 'modern-minimalist-building'),
    exif: { camera: 'Sony A7R5 / 24-70mm F2.8', aperture: 'F/8.0', shutter: '1/400s', iso: 'ISO 100', date: '2024.12.26' }
  },
  {
    id: 'p13',
    category: 'pixels',
    subcategory: 'pixels.grain',
    title: '霓虹沉思',
    width: 904, height: 1200,
    img: localImages('pixels', 'neon-contemplation'),
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.0', shutter: '1/60s', iso: 'ISO 1600', date: '2024.12.12' }
  }
]

export { PHOTOS, PHOTO_CATEGORIES }
