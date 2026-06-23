/**
 * 摄影作品数据
 * - 图片使用 Unsplash CDN 真实摄影直链
 * - 4 个分类各 6 张，合计 24 张
 * - 每张带完整 EXIF 元数据（Lightbox 内展示）
 */

const PHOTO_CATEGORIES = [
  { key: 'all', labelEN: 'All', labelCN: '全部' },
  { key: 'frame', labelEN: 'Beyond the Frame Rate', labelCN: '帧率之外' },
  { key: 'frame.narrative', labelEN: 'Narrative Frames', labelCN: '叙事瞬间' },
  { key: 'exposure', labelEN: 'Exposure Log', labelCN: '曝光日志' },
  { key: 'exposure.available-light', labelEN: 'Available Light', labelCN: '可用光' },
  { key: 'pixels', labelEN: 'Redundant Pixels', labelCN: '冗余像素' },
  { key: 'pixels.grain', labelEN: 'Grain Residue', labelCN: '颗粒残像' }
]

const PHOTOS = [
  // ===== Beyond the Frame Rate 帧率之外 =====
  {
    id: 'p01',
    category: 'frame',
    photoId: '1500648767791-00dcc994a43e',
    title: '窗边午后',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/1.8', shutter: '1/320s', iso: 'ISO 200', date: '2025.04.12' }
  },
  {
    id: 'p02',
    category: 'frame',
    photoId: '1488426862026-3ee34a7d66df',
    title: '光与轮廓',
    width: 1200, height: 1600,
    exif: { camera: 'Leica Q3 / 28mm', aperture: 'F/2.0', shutter: '1/500s', iso: 'ISO 100', date: '2025.02.28' }
  },
  {
    id: 'p03',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1438761681033-6461ffad8d80',
    title: '工作室 #7',
    width: 1200, height: 1500,
    exif: { camera: 'Canon R5 / 85mm F1.2', aperture: 'F/1.4', shutter: '1/250s', iso: 'ISO 400', date: '2025.05.03' }
  },
  {
    id: 'p04',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1494790108377-be9c29b29330',
    title: '眼睛的颜色',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/2.8', shutter: '1/200s', iso: 'ISO 800', date: '2025.03.18' }
  },
  {
    id: 'p05',
    category: 'frame',
    photoId: '1531746020798-e6953c6e8e04',
    title: '素色',
    width: 1200, height: 1600,
    exif: { camera: 'Fuji X-T5 / 56mm F1.2', aperture: 'F/1.2', shutter: '1/1000s', iso: 'ISO 200', date: '2025.01.15' }
  },
  {
    id: 'p06',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1517841905240-472988babdf9',
    title: '雨后',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A7M4 / 85mm F1.8', aperture: 'F/2.0', shutter: '1/400s', iso: 'ISO 400', date: '2025.04.22' }
  },

  // ===== Exposure Log 曝光日志 =====
  {
    id: 'p07',
    category: 'exposure',
    photoId: '1769433857600-b00eb44ea79d',
    title: '昆明岩石山',
    width: 1600, height: 1067,
    exif: { camera: 'Nikon Z8 / 24-70mm F2.8', aperture: 'F/8.0', shutter: '1/250s', iso: 'ISO 100', date: '2024.11.08' }
  },
  {
    id: 'p08',
    category: 'exposure',
    photoId: '1779715203771-28e65a830965',
    title: '瑞士山林',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A7R5 / 16-35mm F2.8', aperture: 'F/11', shutter: '1/125s', iso: 'ISO 100', date: '2024.10.21' }
  },
  {
    id: 'p09',
    category: 'exposure',
    photoId: '1469474968028-56623f02e42e',
    title: '海岸线',
    width: 1600, height: 1067,
    exif: { camera: 'Canon R5 / 17-40mm F4', aperture: 'F/11', shutter: '1/60s', iso: 'ISO 200', date: '2024.08.14' }
  },
  {
    id: 'p10',
    category: 'exposure',
    photoId: '1501785888041-af3ef285b470',
    title: '北方湖泊',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A7M4 / 24mm F1.4', aperture: 'F/8.0', shutter: '1/200s', iso: 'ISO 100', date: '2024.07.02' }
  },
  {
    id: 'p11',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    photoId: '1470770841072-f978cf4d019e',
    title: '峡湾之晨',
    width: 1600, height: 1067,
    exif: { camera: 'Nikon Z8 / 70-200mm F2.8', aperture: 'F/5.6', shutter: '1/500s', iso: 'ISO 200', date: '2024.06.19' }
  },
  {
    id: 'p12',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    photoId: '1518837695005-2083093ee35b',
    title: '海雾',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/2.8', shutter: '1/1000s', iso: 'ISO 100', date: '2024.09.30' }
  },

  // ===== Redundant Pixels 冗余像素 =====
  {
    id: 'p13',
    category: 'pixels',
    photoId: '1724675708738-ced3a150247e',
    title: '曼哈顿小意大利',
    width: 1200, height: 1500,
    exif: { camera: 'Leica M6 / 35mm F2 (Kodak Tri-X 400)', aperture: 'F/8.0', shutter: '1/125s', iso: 'ISO 400', date: '2024.12.05' }
  },
  {
    id: 'p14',
    category: 'pixels',
    photoId: '1732631591676-d1d96bf18331',
    title: '马拉加窄巷',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A6700 / 23mm F2', aperture: 'F/5.6', shutter: '1/250s', iso: 'ISO 800', date: '2024.11.26' }
  },
  {
    id: 'p15',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1640900935456-be5332f28a1a',
    title: '夜街',
    width: 1200, height: 1600,
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/2.8', shutter: '1/30s', iso: 'ISO 1600', date: '2024.10.18' }
  },
  {
    id: 'p16',
    category: 'pixels',
    photoId: '1733247489206-f66cee6c509c',
    title: '隧道',
    width: 1200, height: 1500,
    exif: { camera: 'Leica Q2 / 28mm F1.7', aperture: 'F/4.0', shutter: '1/60s', iso: 'ISO 800', date: '2024.11.02' }
  },
  {
    id: 'p17',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1449034446853-66c86144b0ad',
    title: '霓虹路口',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/1.8', shutter: '1/100s', iso: 'ISO 1600', date: '2024.09.10' }
  },
  {
    id: 'p18',
    category: 'pixels',
    photoId: '1492571350019-22de08371fd3',
    title: '车站',
    width: 1200, height: 1500,
    exif: { camera: 'Fuji X100V / 23mm F2', aperture: 'F/4.0', shutter: '1/250s', iso: 'ISO 400', date: '2024.08.25' }
  },

  // ===== Beyond the Frame Rate (continued) =====
  {
    id: 'p19',
    category: 'frame',
    photoId: '1504198266286-1cd2f0b39e22',
    title: '市场',
    width: 1600, height: 1067,
    exif: { camera: 'Leica M11 / 35mm F1.4', aperture: 'F/2.0', shutter: '1/250s', iso: 'ISO 800', date: '2024.07.18' }
  },
  {
    id: 'p20',
    category: 'frame',
    photoId: '1521134888717-7d6b4b0a8c98',
    title: '码头工人',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A7R5 / 50mm F1.4', aperture: 'F/2.8', shutter: '1/500s', iso: 'ISO 200', date: '2024.06.30' }
  },
  {
    id: 'p21',
    category: 'exposure',
    photoId: '1509099836639-18ba1795216d',
    title: '街头艺人',
    width: 1600, height: 1067,
    exif: { camera: 'Canon R6 / 35mm F1.8', aperture: 'F/2.0', shutter: '1/200s', iso: 'ISO 1600', date: '2024.05.22' }
  },
  {
    id: 'p22',
    category: 'exposure',
    photoId: '1517457373958-b7bdd4587205',
    title: '工厂车间',
    width: 1600, height: 1067,
    exif: { camera: 'Leica SL2 / 24mm F2.8', aperture: 'F/4.0', shutter: '1/125s', iso: 'ISO 800', date: '2024.04.10' }
  },
  {
    id: 'p23',
    category: 'pixels',
    photoId: '1505236858219-8359eb29e329',
    title: '街头童年',
    width: 1600, height: 1067,
    exif: { camera: 'Fuji GFX 50S / 63mm F2.8', aperture: 'F/4.0', shutter: '1/250s', iso: 'ISO 400', date: '2024.03.05' }
  },
  {
    id: 'p24',
    category: 'pixels',
    photoId: '1469571486292-0ba58a3f068b',
    title: '游行',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A1 / 24-70mm F2.8', aperture: 'F/4.0', shutter: '1/640s', iso: 'ISO 200', date: '2024.02.14' }
  },

  // ===== Beyond the Frame Rate (新增) =====
  {
    id: 'p25',
    category: 'frame',
    photoId: '1534528741775-53994a69daeb',
    title: '午后咖啡馆',
    width: 1200, height: 1500,
    exif: { camera: 'Fuji X-T5 / 56mm F1.2', aperture: 'F/1.4', shutter: '1/500s', iso: 'ISO 200', date: '2025.06.10' }
  },
  {
    id: 'p26',
    category: 'frame',
    photoId: '1524504388940-b1c1722653e1',
    title: '窗台',
    width: 1200, height: 1600,
    exif: { camera: 'Sony A7M4 / 85mm F1.8', aperture: 'F/2.0', shutter: '1/400s', iso: 'ISO 100', date: '2025.05.28' }
  },
  {
    id: 'p27',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1488426862026-3ee34a7d66df',
    title: '回眸',
    width: 1200, height: 1500,
    exif: { camera: 'Leica Q3 / 28mm', aperture: 'F/2.0', shutter: '1/320s', iso: 'ISO 400', date: '2025.05.15' }
  },
  {
    id: 'p28',
    category: 'frame',
    photoId: '1506794778202-cad84cf45f1d',
    title: '侧影',
    width: 1200, height: 1500,
    exif: { camera: 'Canon R5 / 85mm F1.2', aperture: 'F/1.8', shutter: '1/250s', iso: 'ISO 200', date: '2025.04.30' }
  },
  {
    id: 'p29',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1487412720507-e7ab37603c6f',
    title: '清晨',
    width: 1200, height: 1600,
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/1.6', shutter: '1/400s', iso: 'ISO 100', date: '2025.04.18' }
  },
  {
    id: 'p30',
    category: 'frame',
    photoId: '1494790108377-be9c29b29330',
    title: '蓝调',
    width: 1200, height: 1500,
    exif: { camera: 'Fuji X-T5 / 35mm F1.4', aperture: 'F/2.0', shutter: '1/200s', iso: 'ISO 800', date: '2025.03.25' }
  },
  {
    id: 'p31',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1517841905240-472988babdf9',
    title: '雨伞',
    width: 1200, height: 1500,
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.8', shutter: '1/125s', iso: 'ISO 400', date: '2025.03.10' }
  },
  {
    id: 'p32',
    category: 'frame',
    photoId: '1531746020798-e6953c6e8e04',
    title: '柔光',
    width: 1200, height: 1600,
    exif: { camera: 'Sony A7R5 / 85mm F1.4', aperture: 'F/1.4', shutter: '1/640s', iso: 'ISO 100', date: '2025.02.20' }
  },
  {
    id: 'p33',
    category: 'frame',
    photoId: '1500648767791-00dcc994a43e',
    title: '阴影',
    width: 1200, height: 1500,
    exif: { camera: 'Canon R5 / 50mm F1.2', aperture: 'F/1.6', shutter: '1/500s', iso: 'ISO 200', date: '2025.02.08' }
  },
  {
    id: 'p34',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1438761681033-6461ffad8d80',
    title: '沉思',
    width: 1200, height: 1500,
    exif: { camera: 'Nikon Z8 / 85mm F1.4', aperture: 'F/1.8', shutter: '1/320s', iso: 'ISO 400', date: '2025.01.30' }
  },

  // ===== Exposure Log (新增) =====
  {
    id: 'p35',
    category: 'exposure',
    photoId: '1470071459604-3b5ec3a7fe05',
    title: '云海',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A7R5 / 24-70mm F2.8', aperture: 'F/8.0', shutter: '1/250s', iso: 'ISO 100', date: '2024.12.20' }
  },
  {
    id: 'p36',
    category: 'exposure',
    photoId: '1472214103451-9374f226dde3',
    title: '麦田',
    width: 1600, height: 1067,
    exif: { camera: 'Canon R5 / 35mm F1.4', aperture: 'F/5.6', shutter: '1/500s', iso: 'ISO 100', date: '2024.12.08' }
  },
  {
    id: 'p37',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    photoId: '1433086966358-54859d0ed716',
    title: '瀑布',
    width: 1600, height: 1067,
    exif: { camera: 'Nikon Z8 / 16-35mm F4', aperture: 'F/11', shutter: '1/2s', iso: 'ISO 100', date: '2024.11.25' }
  },
  {
    id: 'p38',
    category: 'exposure',
    photoId: '1507003211169-0a1dd7228f2d',
    title: '沙漠',
    width: 1600, height: 1067,
    exif: { camera: 'Leica SL2 / 24-90mm F2.8', aperture: 'F/8.0', shutter: '1/320s', iso: 'ISO 100', date: '2024.11.15' }
  },
  {
    id: 'p39',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    photoId: '1501785888041-af3ef285b470',
    title: '日出',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A7M4 / 70-200mm F2.8', aperture: 'F/5.6', shutter: '1/1000s', iso: 'ISO 200', date: '2024.11.01' }
  },
  {
    id: 'p40',
    category: 'exposure',
    photoId: '1470770841072-f978cf4d019e',
    title: '日落',
    width: 1600, height: 1067,
    exif: { camera: 'Fuji GFX 100 / 32-64mm F4', aperture: 'F/8.0', shutter: '1/125s', iso: 'ISO 100', date: '2024.10.18' }
  },
  {
    id: 'p41',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    photoId: '1518837695005-2083093ee35b',
    title: '极光',
    width: 1600, height: 1067,
    exif: { camera: 'Sony A7S3 / 14mm F1.8', aperture: 'F/1.8', shutter: '15s', iso: 'ISO 3200', date: '2024.10.05' }
  },
  {
    id: 'p42',
    category: 'exposure',
    photoId: '1501785888041-af3ef285b470',
    title: '冰川',
    width: 1600, height: 1067,
    exif: { camera: 'Canon R5 / 24-70mm F2.8', aperture: 'F/8.0', shutter: '1/500s', iso: 'ISO 100', date: '2024.09.22' }
  },
  {
    id: 'p43',
    category: 'exposure',
    photoId: '1469474968028-56623f02e42e',
    title: '红叶',
    width: 1600, height: 1067,
    exif: { camera: 'Nikon Z9 / 105mm F2.8', aperture: 'F/4.0', shutter: '1/250s', iso: 'ISO 200', date: '2024.09.10' }
  },
  {
    id: 'p44',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    photoId: '1779715203771-28e65a830965',
    title: '雾凇',
    width: 1600, height: 1067,
    exif: { camera: 'Leica SL2 / 50mm F1.4', aperture: 'F/2.8', shutter: '1/320s', iso: 'ISO 100', date: '2024.08.28' }
  },

  // ===== Redundant Pixels (新增) =====
  {
    id: 'p45',
    category: 'pixels',
    photoId: '1449824913935-59a10b8d2000',
    title: '城市霓虹',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/1.8', shutter: '1/60s', iso: 'ISO 1600', date: '2024.12.15' }
  },
  {
    id: 'p46',
    category: 'pixels',
    photoId: '1444084318824-051a63a4cb2d',
    title: '夜市',
    width: 1200, height: 1500,
    exif: { camera: 'Leica Q2 / 28mm F1.7', aperture: 'F/2.0', shutter: '1/100s', iso: 'ISO 800', date: '2024.12.01' }
  },
  {
    id: 'p47',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1519501025264-65ba15a82390',
    title: '老街',
    width: 1200, height: 1600,
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/2.8', shutter: '1/15s', iso: 'ISO 3200', date: '2024.11.20' }
  },
  {
    id: 'p48',
    category: 'pixels',
    photoId: '1493976040374-85c8e12f0c0e',
    title: '寺庙',
    width: 1200, height: 1500,
    exif: { camera: 'Fuji X100V / 23mm F2', aperture: 'F/4.0', shutter: '1/250s', iso: 'ISO 400', date: '2024.11.08' }
  },
  {
    id: 'p49',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1506905925346-21bda4d32df4',
    title: '星空',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A7S3 / 14mm F1.8', aperture: 'F/1.8', shutter: '20s', iso: 'ISO 6400', date: '2024.10.25' }
  },
  {
    id: 'p50',
    category: 'pixels',
    photoId: '1516483638261-f4dbaf036963',
    title: '小巷',
    width: 1200, height: 1500,
    exif: { camera: 'Leica M6 / 35mm F2 (Kodak Portra 400)', aperture: 'F/5.6', shutter: '1/125s', iso: 'ISO 400', date: '2024.10.12' }
  },
  {
    id: 'p51',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1473496169904-658ba7574b1d',
    title: '地铁',
    width: 1200, height: 1600,
    exif: { camera: 'Fuji X-T5 / 23mm F2', aperture: 'F/2.0', shutter: '1/30s', iso: 'ISO 2000', date: '2024.09.28' }
  },
  {
    id: 'p52',
    category: 'pixels',
    photoId: '1480714378408-67cf0d13bc1b',
    title: '天际线',
    width: 1200, height: 1500,
    exif: { camera: 'Sony A7R5 / 24mm F1.4', aperture: 'F/8.0', shutter: '1/200s', iso: 'ISO 100', date: '2024.09.15' }
  },
  {
    id: 'p53',
    category: 'pixels',
    photoId: '1508193638397-1c4234db14d8',
    title: '倒影',
    width: 1200, height: 1500,
    exif: { camera: 'Canon R5 / 35mm F1.4', aperture: 'F/4.0', shutter: '1/500s', iso: 'ISO 200', date: '2024.09.01' }
  },
  {
    id: 'p54',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1465146344425-f00d5f5c8f07',
    title: '烟花',
    width: 1200, height: 1600,
    exif: { camera: 'Nikon Z8 / 24mm F1.4', aperture: 'F/5.6', shutter: '2s', iso: 'ISO 400', date: '2024.08.18' }
  }
]

/**
 * 构造 Unsplash CDN URL
 * - 普通：质量 80，宽度 800
 * - 缩略：质量 70，宽度 400
 * - 灯箱原图：质量 85，宽度 1600
 */
function unsplashUrl(photoId, { width = 800, quality = 80 } = {}) {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=${quality}&auto=format&fit=crop`
}

export { PHOTOS, PHOTO_CATEGORIES, unsplashUrl }
