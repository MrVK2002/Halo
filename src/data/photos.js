/**
 * 摄影作品数据
 * - 原图位于 public/images/portfolio，页面使用 public/images/portfolio-optimized 下的 WebP
 * - 6 个独立作品集（无子分类概念），合计 48 张，每张仅归属一个作品集
 * - 每张带完整 EXIF 元数据（Lightbox 内展示）
 */
import placeholders from './photo-placeholders.json'

const PHOTO_CATEGORIES = [
  { key: 'all', labelEN: 'All', labelCN: '全部' },
  { key: 'frame', labelEN: 'Beyond the Frame Rate', labelCN: '帧率之外' },
  { key: 'narrative', labelEN: 'Narrative Frames', labelCN: '叙事瞬间' },
  { key: 'exposure', labelEN: 'Exposure Log', labelCN: '曝光日志' },
  { key: 'available-light', labelEN: 'Available Light', labelCN: '可用光' },
  { key: 'pixels', labelEN: 'Redundant Pixels', labelCN: '冗余像素' },
  { key: 'grain', labelEN: 'Grain Residue', labelCN: '颗粒残像' }
]

/**
 * 原图文件名映射
 * - key：`${目录}/${slug}`，value：public/images/portfolio 下源文件的实际文件名
 * - 源文件命名与 slug 不完全一致（空格与下划线混用），故显式维护映射，避免拼错导致下载 404
 */
const ORIGINAL_FILES = {
  // frame
  'frame/floral-portrait-harmony': 'Floral Portrait Harmony.png',
  'frame/analyst-at-work': 'Analyst at Work.png',
  'frame/dynamic-woman-portrait': 'Dynamic Woman Portrait.png',
  'frame/silhouette-in-soft-light': 'Silhouette in Soft Light.png',
  'frame/runner-in-motion-blur': 'Runner in Motion Blur.png',
  'frame/silhouette-at-sunset': 'Silhouette at Sunset.png',
  'frame/boardwalk-runners': 'Boardwalk_Runners.png',
  'frame/contemplative-young-man-in-urban-setting': 'Contemplative_Young_Man_in_Urban_Setting.png',
  'frame/man-taking-selfie': 'Man_Taking_Selfie.png',
  'frame/selfie-in-creative-studio': 'Selfie_in_Creative_Studio.png',
  'frame/sporty-elegance-outdoors': 'Sporty_Elegance_Outdoors.png',
  // exposure
  'exposure/classic-car-by-the-coast': 'Classic Car by the Coast.png',
  'exposure/modern-hilltop-structure': 'Modern Hilltop Structure.png',
  'exposure/volcanic-cinder-cone': 'Volcanic Cinder Cone.png',
  'exposure/serene-coastal-sunset': 'Serene Coastal Sunset.png',
  'exposure/overgrown-stone-ruins': 'Overgrown Stone Ruins.png',
  'exposure/red-shed-on-hillside': 'Red Shed on Hillside.png',
  'exposure/serene-sunset-kayaking': 'Serene Sunset Kayaking.png',
  'exposure/golden-hour-city-street': 'Golden_Hour_City_Street.png',
  'exposure/majestic-mountain-range': 'Majestic_Mountain_Range.png',
  // pixels
  'pixels/modern-architectural-elegance': 'Modern Architectural Elegance.png',
  'pixels/modern-architectural-structure': 'Modern Architectural Structure.png',
  'pixels/modern-cantilevered-house': 'Modern Cantilevered House.png',
  'pixels/modern-minimalist-building': 'Modern Minimalist Building.png',
  'pixels/man-in-urban-chaos': 'Man in Urban Chaos.png',
  'pixels/modern-architectural-elegance-at-twilight': 'Modern Architectural Elegance at Twilight.png',
  'pixels/neon-contemplation': 'Neon Contemplation.png',
  'pixels/nighttime-urban-storefront': 'Nighttime Urban Storefront.png',
  'pixels/urban-crosswalk-scene': 'Urban Crosswalk Scene.png',
  'pixels/blue-sports-car-at-night': 'Blue Sports Car at Night.png',
  'pixels/modern-house-twilight-scene': 'Modern_House_Twilight_Scene.png',
  'pixels/vibrant-light-trails': 'Vibrant_Light_Trails.png'
}

/**
 * 生成本地图片路径
 * - 第一个参数是图片存放的目录名，与作品集 key 解耦（作品集调整不影响图片路径）
 * - 原图目录只放源文件，页面统一读取优化目录；original 供灯箱「下载原图」使用
 */
function localImages(folder, slug) {
  const key = `${folder}/${slug}`
  const base = `/images/portfolio-optimized/${folder}/${slug}`
  const originalName = ORIGINAL_FILES[key]
  return {
    thumb: `${base}-400.webp`,
    display: `${base}-800.webp`,
    full: `${base}-1600.webp`,
    original: originalName ? `/images/portfolio/${folder}/${encodeURIComponent(originalName)}` : '',
    placeholder: placeholders[key] || ''
  }
}

const PHOTOS = [
  // ===== Beyond the Frame Rate 帧率之外 =====
  {
    id: 'p03',
    category: 'frame',
    title: '花间肖像',
    width: 960, height: 1200,
    img: localImages('frame', 'floral-portrait-harmony'),
    exif: { camera: 'Fuji X-T5 / 56mm F1.2', aperture: 'F/1.4', shutter: '1/500s', iso: 'ISO 200', date: '2025.05.10' }
  },

  // ===== Narrative Frames 叙事瞬间 =====
  {
    id: 'p01',
    category: 'narrative',
    title: '专注时刻',
    width: 908, height: 1200,
    img: localImages('frame', 'analyst-at-work'),
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/2.0', shutter: '1/160s', iso: 'ISO 800', date: '2025.06.12' }
  },
  {
    id: 'p02',
    category: 'narrative',
    title: '流动的肖像',
    width: 960, height: 1200,
    img: localImages('frame', 'dynamic-woman-portrait'),
    exif: { camera: 'Canon R5 / 85mm F1.2', aperture: 'F/1.8', shutter: '1/250s', iso: 'ISO 400', date: '2025.05.28' }
  },
  {
    id: 'p14',
    category: 'narrative',
    title: '柔光剪影',
    width: 904, height: 1200,
    img: localImages('frame', 'silhouette-in-soft-light'),
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.0', shutter: '1/250s', iso: 'ISO 400', date: '2025.06.20' }
  },
  {
    id: 'p18',
    category: 'narrative',
    title: '奔跑残影',
    width: 992, height: 1200,
    img: localImages('frame', 'runner-in-motion-blur'),
    exif: { camera: 'Sony A7M4 / 85mm F1.8', aperture: 'F/2.8', shutter: '1/60s', iso: 'ISO 400', date: '2025.06.05' }
  },
  {
    id: 'p19',
    category: 'narrative',
    title: '落日剪影',
    width: 960, height: 1200,
    img: localImages('frame', 'silhouette-at-sunset'),
    exif: { camera: 'Canon R5 / 70-200mm F2.8', aperture: 'F/4.0', shutter: '1/800s', iso: 'ISO 200', date: '2025.05.22' }
  },
  {
    id: 'p24',
    category: 'narrative',
    title: '木栈奔跑',
    width: 904, height: 1200,
    img: localImages('frame', 'boardwalk-runners'),
    exif: { camera: 'Sony A7M4 / 70-200mm F2.8', aperture: 'F/4.0', shutter: '1/500s', iso: 'ISO 400', date: '2025.06.18' }
  },
  {
    id: 'p25',
    category: 'narrative',
    title: '城市沉思',
    width: 1200, height: 673,
    img: localImages('frame', 'contemplative-young-man-in-urban-setting'),
    exif: { camera: 'Leica Q3 / 28mm', aperture: 'F/2.8', shutter: '1/250s', iso: 'ISO 400', date: '2025.06.02' }
  },
  {
    id: 'p26',
    category: 'narrative',
    title: '街头自拍',
    width: 673, height: 1200,
    img: localImages('frame', 'man-taking-selfie'),
    exif: { camera: 'Fuji X100V / 23mm F2', aperture: 'F/2.8', shutter: '1/125s', iso: 'ISO 320', date: '2025.05.19' }
  },
  {
    id: 'p27',
    category: 'narrative',
    title: '工作室自拍',
    width: 673, height: 1200,
    img: localImages('frame', 'selfie-in-creative-studio'),
    exif: { camera: 'Canon R5 / 35mm F1.4', aperture: 'F/2.0', shutter: '1/160s', iso: 'ISO 200', date: '2025.05.06' }
  },
  {
    id: 'p28',
    category: 'narrative',
    title: '户外运动风尚',
    width: 992, height: 1200,
    img: localImages('frame', 'sporty-elegance-outdoors'),
    exif: { camera: 'Sony A7M4 / 85mm F1.8', aperture: 'F/2.2', shutter: '1/640s', iso: 'ISO 200', date: '2025.04.25' }
  },
  {
    id: 'p33',
    category: 'narrative',
    title: '高反差肖像',
    width: 904, height: 1200,
    img: localImages('frame', 'high-contrast-portrait'),
    exif: { camera: 'Sony A7M4 / 85mm F1.4', aperture: 'F/1.6', shutter: '1/200s', iso: 'ISO 200', date: '2025.07.02' }
  },
  {
    id: 'p34',
    category: 'narrative',
    title: '动势剪影',
    width: 904, height: 1200,
    img: localImages('frame', 'silhouette-in-motion'),
    exif: { camera: 'Canon R5 / 50mm F1.2', aperture: 'F/2.0', shutter: '1/1000s', iso: 'ISO 100', date: '2025.06.28' }
  },
  {
    id: 'p38',
    category: 'narrative',
    title: '黑白肖像',
    width: 960, height: 1200,
    img: localImages('frame', 'black-and-white-portrait'),
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.0', shutter: '1/250s', iso: 'ISO 400', date: '2025.07.10' }
  },
  {
    id: 'p39',
    category: 'narrative',
    title: '黑白肖像 II',
    width: 1200, height: 673,
    img: localImages('frame', 'black-and-white-portrait-ii'),
    exif: { camera: 'Leica M11 / 35mm F2', aperture: 'F/2.8', shutter: '1/320s', iso: 'ISO 400', date: '2025.07.10' }
  },
  {
    id: 'p40',
    category: 'narrative',
    title: '动势沉思',
    width: 673, height: 1200,
    img: localImages('frame', 'contemplative-woman-in-motion'),
    exif: { camera: 'Canon R5 / 85mm F1.2', aperture: 'F/1.8', shutter: '1/200s', iso: 'ISO 320', date: '2025.07.06' }
  },
  {
    id: 'p41',
    category: 'narrative',
    title: '动势肖像',
    width: 904, height: 1200,
    img: localImages('frame', 'dynamic-portrait-scene'),
    exif: { camera: 'Sony A7M4 / 85mm F1.8', aperture: 'F/2.0', shutter: '1/400s', iso: 'ISO 250', date: '2025.06.30' }
  },
  {
    id: 'p42',
    category: 'narrative',
    title: '城市内省',
    width: 960, height: 1200,
    img: localImages('frame', 'introspective-urban-portrait'),
    exif: { camera: 'Fuji X100V / 23mm F2', aperture: 'F/2.8', shutter: '1/125s', iso: 'ISO 500', date: '2025.06.24' }
  },
  {
    id: 'p43',
    category: 'narrative',
    title: '晴日肖像',
    width: 960, height: 1200,
    img: localImages('frame', 'sunny-day-portrait'),
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/2.2', shutter: '1/800s', iso: 'ISO 100', date: '2025.06.14' }
  },
  {
    id: 'p44',
    category: 'narrative',
    title: '城市少年',
    width: 1200, height: 800,
    img: localImages('frame', 'urban-scene-with-young-person'),
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/4.0', shutter: '1/320s', iso: 'ISO 200', date: '2025.06.08' }
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

  // ===== Available Light 可用光 =====
  {
    id: 'p05',
    category: 'available-light',
    title: '山丘之上',
    width: 900, height: 1200,
    img: localImages('exposure', 'modern-hilltop-structure'),
    exif: { camera: 'Sony A7R5 / 16-35mm F2.8', aperture: 'F/8.0', shutter: '1/250s', iso: 'ISO 100', date: '2025.04.05' }
  },
  {
    id: 'p06',
    category: 'available-light',
    title: '火山渣锥',
    width: 1200, height: 800,
    img: localImages('exposure', 'volcanic-cinder-cone'),
    exif: { camera: 'Nikon Z8 / 70-200mm F2.8', aperture: 'F/11', shutter: '1/320s', iso: 'ISO 100', date: '2025.03.18' }
  },
  {
    id: 'p15',
    category: 'available-light',
    title: '海岸落日',
    width: 800, height: 1200,
    img: localImages('exposure', 'serene-coastal-sunset'),
    exif: { camera: 'Sony A7R5 / 16-35mm F2.8', aperture: 'F/8.0', shutter: '1/250s', iso: 'ISO 100', date: '2025.05.30' }
  },
  {
    id: 'p20',
    category: 'available-light',
    title: '藤蔓石迹',
    width: 904, height: 1200,
    img: localImages('exposure', 'overgrown-stone-ruins'),
    exif: { camera: 'Fuji GFX 100 / 32-64mm F4', aperture: 'F/8.0', shutter: '1/200s', iso: 'ISO 100', date: '2025.05.08' }
  },
  {
    id: 'p21',
    category: 'available-light',
    title: '山坡红屋',
    width: 900, height: 1200,
    img: localImages('exposure', 'red-shed-on-hillside'),
    exif: { camera: 'Sony A7M4 / 24-70mm F2.8', aperture: 'F/8.0', shutter: '1/320s', iso: 'ISO 100', date: '2025.04.16' }
  },
  {
    id: 'p22',
    category: 'available-light',
    title: '日落泛舟',
    width: 800, height: 1200,
    img: localImages('exposure', 'serene-sunset-kayaking'),
    exif: { camera: 'Canon R5 / 70-200mm F2.8', aperture: 'F/5.6', shutter: '1/500s', iso: 'ISO 200', date: '2025.04.09' }
  },
  {
    id: 'p29',
    category: 'available-light',
    title: '黄金时刻街景',
    width: 1200, height: 1200,
    img: localImages('exposure', 'golden-hour-city-street'),
    exif: { camera: 'Leica Q3 / 28mm', aperture: 'F/5.6', shutter: '1/400s', iso: 'ISO 200', date: '2025.04.02' }
  },
  {
    id: 'p30',
    category: 'available-light',
    title: '巍峨山脉',
    width: 1200, height: 686,
    img: localImages('exposure', 'majestic-mountain-range'),
    exif: { camera: 'Sony A7R5 / 16-35mm F2.8', aperture: 'F/11', shutter: '1/320s', iso: 'ISO 100', date: '2025.03.12' }
  },
  {
    id: 'p45',
    category: 'available-light',
    title: '极简树影',
    width: 1200, height: 800,
    img: localImages('exposure', 'minimalist-tree-scene'),
    exif: { camera: 'Sony A7R5 / 24-70mm F2.8', aperture: 'F/8.0', shutter: '1/500s', iso: 'ISO 100', date: '2025.05.26' }
  },

  // ===== Redundant Pixels 冗余像素 =====
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
    id: 'p46',
    category: 'pixels',
    title: '扶梯动势',
    width: 904, height: 1200,
    img: localImages('pixels', 'dynamic-escalator-scene'),
    exif: { camera: 'Sony A7M4 / 24-70mm F2.8', aperture: 'F/4.0', shutter: '1/30s', iso: 'ISO 800', date: '2025.06.21' }
  },
  {
    id: 'p47',
    category: 'pixels',
    title: '街头掠影',
    width: 900, height: 1200,
    img: localImages('pixels', 'urban-street-photography'),
    exif: { camera: 'Fuji X100V / 23mm F2', aperture: 'F/5.6', shutter: '1/250s', iso: 'ISO 400', date: '2025.06.16' }
  },

  // ===== Grain Residue 颗粒残像 =====
  {
    id: 'p07',
    category: 'grain',
    title: '城市喧嚣',
    width: 904, height: 1200,
    img: localImages('pixels', 'man-in-urban-chaos'),
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/2.8', shutter: '1/125s', iso: 'ISO 1600', date: '2025.03.02' }
  },
  {
    id: 'p08',
    category: 'grain',
    title: '暮色建筑',
    width: 1200, height: 686,
    img: localImages('pixels', 'modern-architectural-elegance-at-twilight'),
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/5.6', shutter: '1/125s', iso: 'ISO 400', date: '2025.02.14' }
  },
  {
    id: 'p13',
    category: 'grain',
    title: '霓虹沉思',
    width: 904, height: 1200,
    img: localImages('pixels', 'neon-contemplation'),
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.0', shutter: '1/60s', iso: 'ISO 1600', date: '2024.12.12' }
  },
  {
    id: 'p16',
    category: 'grain',
    title: '夜色店招',
    width: 904, height: 1200,
    img: localImages('pixels', 'nighttime-urban-storefront'),
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/2.8', shutter: '1/60s', iso: 'ISO 1600', date: '2025.05.16' }
  },
  {
    id: 'p17',
    category: 'grain',
    title: '城市斑马线',
    width: 1200, height: 800,
    img: localImages('pixels', 'urban-crosswalk-scene'),
    exif: { camera: 'Fuji X100V / 23mm F2', aperture: 'F/4.0', shutter: '1/250s', iso: 'ISO 400', date: '2025.04.28' }
  },
  {
    id: 'p23',
    category: 'grain',
    title: '夜色跑车',
    width: 840, height: 1200,
    img: localImages('pixels', 'blue-sports-car-at-night'),
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/1.8', shutter: '1/80s', iso: 'ISO 1600', date: '2025.03.25' }
  },
  {
    id: 'p31',
    category: 'grain',
    title: '暮色现代宅',
    width: 1200, height: 686,
    img: localImages('pixels', 'modern-house-twilight-scene'),
    exif: { camera: 'Sony A7M4 / 24-70mm F2.8', aperture: 'F/5.6', shutter: '1/60s', iso: 'ISO 800', date: '2025.03.08' }
  },
  {
    id: 'p32',
    category: 'grain',
    title: '流光轨迹',
    width: 960, height: 1200,
    img: localImages('pixels', 'vibrant-light-trails'),
    exif: { camera: 'Canon R5 / 24mm F1.4', aperture: 'F/8.0', shutter: '8s', iso: 'ISO 100', date: '2025.02.21' }
  },
  {
    id: 'p35',
    category: 'grain',
    title: '光斑浮影',
    width: 1200, height: 898,
    img: localImages('pixels', 'abstract-bokeh-glow'),
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/1.4', shutter: '1/60s', iso: 'ISO 1600', date: '2025.02.08' }
  },
  {
    id: 'p36',
    category: 'grain',
    title: '像素辉光',
    width: 800, height: 1200,
    img: localImages('pixels', 'abstract-digital-glow'),
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.0', shutter: '1/30s', iso: 'ISO 3200', date: '2025.01.26' }
  },
  {
    id: 'p37',
    category: 'grain',
    title: '夜色敞篷',
    width: 840, height: 1200,
    img: localImages('pixels', 'black-convertible-at-night'),
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/1.8', shutter: '1/60s', iso: 'ISO 2000', date: '2025.01.14' }
  },
  {
    id: 'p48',
    category: 'grain',
    title: '夜色街景',
    width: 904, height: 1200,
    img: localImages('pixels', 'nighttime-street-scene'),
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/2.8', shutter: '1/40s', iso: 'ISO 3200', date: '2025.01.02' }
  }
]

export { PHOTOS, PHOTO_CATEGORIES }
