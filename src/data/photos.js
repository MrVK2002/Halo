/**
 * 摄影作品数据
 * - 图片使用 Unsplash CDN 真实摄影直链
 * - 3 个主分类 + 3 个子分类，合计 56 张
 * - 题材以街拍与自然风景为主，含一组黑白作品（mono: true）
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
    photoId: '1441974231531-c6227db76b6e',
    title: '林间晨光',
    width: 1200, height: 800,
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/1.8', shutter: '1/320s', iso: 'ISO 200', date: '2025.04.12' }
  },
  {
    id: 'p02',
    category: 'frame',
    photoId: '1447752875215-b2761acb3c5d',
    title: '树影斑驳',
    width: 1200, height: 800,
    exif: { camera: 'Leica Q3 / 28mm', aperture: 'F/2.0', shutter: '1/500s', iso: 'ISO 100', date: '2025.02.28' }
  },
  {
    id: 'p03',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1501854140801-50d01698950b',
    title: '河谷航拍',
    width: 1200, height: 714,
    exif: { camera: 'Canon R5 / 85mm F1.2', aperture: 'F/1.4', shutter: '1/250s', iso: 'ISO 400', date: '2025.05.03' }
  },
  {
    id: 'p04',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1472396961693-142e6e269027',
    title: '林中小鹿',
    width: 1200, height: 1980,
    exif: { camera: 'Sony A7M4 / 35mm F1.4', aperture: 'F/2.8', shutter: '1/200s', iso: 'ISO 800', date: '2025.03.18' }
  },
  {
    id: 'p05',
    category: 'frame',
    photoId: '1493246507139-91e8fad9978e',
    title: '高山湖泊',
    width: 1200, height: 800,
    exif: { camera: 'Fuji X-T5 / 56mm F1.2', aperture: 'F/1.2', shutter: '1/1000s', iso: 'ISO 200', date: '2025.01.15' }
  },
  {
    id: 'p06',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1519681393784-d120267933ba',
    title: '星空雪山',
    width: 1200, height: 800,
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
    photoId: '1464822759023-fed622ff2c3b',
    title: '群山云海',
    width: 1200, height: 800,
    exif: { camera: 'Fuji X-T5 / 56mm F1.2', aperture: 'F/1.4', shutter: '1/500s', iso: 'ISO 200', date: '2025.06.10' }
  },
  {
    id: 'p26',
    category: 'frame',
    photoId: '1483728642387-6c3bdd6c93e5',
    title: '云上群山',
    width: 1200, height: 792,
    exif: { camera: 'Sony A7M4 / 85mm F1.8', aperture: 'F/2.0', shutter: '1/400s', iso: 'ISO 100', date: '2025.05.28' }
  },
  {
    id: 'p27',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1454496522488-7a8e488e8606',
    title: '雾中公路',
    width: 1200, height: 792,
    exif: { camera: 'Leica Q3 / 28mm', aperture: 'F/2.0', shutter: '1/320s', iso: 'ISO 400', date: '2025.05.15' }
  },
  {
    id: 'p28',
    category: 'frame',
    photoId: '1497436072909-60f360e1d4b1',
    title: '湖畔倒影',
    width: 1200, height: 678,
    exif: { camera: 'Canon R5 / 85mm F1.2', aperture: 'F/1.8', shutter: '1/250s', iso: 'ISO 200', date: '2025.04.30' }
  },
  {
    id: 'p29',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1507525428034-b723cf961d3e',
    title: '热带海岸',
    width: 1200, height: 800,
    exif: { camera: 'Sony A7M4 / 50mm F1.4', aperture: 'F/1.6', shutter: '1/400s', iso: 'ISO 100', date: '2025.04.18' }
  },
  {
    id: 'p30',
    category: 'frame',
    photoId: '1500534314209-a25ddb2bd429',
    title: '沙丘',
    width: 1200, height: 1800,
    exif: { camera: 'Fuji X-T5 / 35mm F1.4', aperture: 'F/2.0', shutter: '1/200s', iso: 'ISO 800', date: '2025.03.25' }
  },
  {
    id: 'p31',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1514565131-fce0801e5785',
    title: '街头车流',
    width: 1200, height: 726,
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.8', shutter: '1/125s', iso: 'ISO 400', date: '2025.03.10' }
  },
  {
    id: 'p32',
    category: 'frame',
    photoId: '1477959858617-67f85cf4f1df',
    title: '城市天际线',
    width: 1200, height: 738,
    exif: { camera: 'Sony A7R5 / 85mm F1.4', aperture: 'F/1.4', shutter: '1/640s', iso: 'ISO 100', date: '2025.02.20' }
  },
  {
    id: 'p33',
    category: 'frame',
    photoId: '1486406146926-c627a92ad1ab',
    title: '玻璃幕墙',
    width: 1200, height: 800,
    exif: { camera: 'Canon R5 / 50mm F1.2', aperture: 'F/1.6', shutter: '1/500s', iso: 'ISO 200', date: '2025.02.08' }
  },
  {
    id: 'p34',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1494522855154-9297ac14b55f',
    title: '夜色街头',
    width: 1200, height: 800,
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
    photoId: '1476514525535-07fb3b4ae5f1',
    title: '林间公路',
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
  },

  // ===== 黑白街头（mono: true，展示时自动去色） =====
  {
    id: 'p55',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1514924013411-cbf25faa35bb',
    title: '黑白切片 #1',
    width: 1200, height: 1788,
    mono: true,
    exif: { camera: 'Leica M6 / 35mm F2 (Ilford HP5 400)', aperture: 'F/5.6', shutter: '1/250s', iso: 'ISO 400', date: '2024.07.18' }
  },
  {
    id: 'p56',
    category: 'pixels',
    photoId: '1444723121867-7a241cacace9',
    title: '黑白切片 #2',
    width: 1200, height: 800,
    mono: true,
    exif: { camera: 'Ricoh GR IIIx', aperture: 'F/4.0', shutter: '1/320s', iso: 'ISO 400', date: '2024.07.06' }
  },
  {
    id: 'p57',
    category: 'pixels',
    subcategory: 'pixels.grain',
    photoId: '1472214103451-9374bd1c798e',
    title: '黑白切片 #3',
    width: 1200, height: 800,
    mono: true,
    exif: { camera: 'Fuji X100V / 23mm F2', aperture: 'F/2.8', shutter: '1/500s', iso: 'ISO 200', date: '2024.06.22' }
  },
  {
    id: 'p58',
    category: 'pixels',
    photoId: '1500530855697-b586d89ba3ee',
    title: '黑白切片 #4',
    width: 1200, height: 1800,
    mono: true,
    exif: { camera: 'Leica Q2 / 28mm F1.7', aperture: 'F/4.0', shutter: '1/250s', iso: 'ISO 400', date: '2024.06.09' }
  },
  {
    id: 'p59',
    category: 'exposure',
    subcategory: 'exposure.available-light',
    photoId: '1496568816309-51d7c20e3b21',
    title: '黑白切片 #5',
    width: 1200, height: 678,
    mono: true,
    exif: { camera: 'Sony A7R5 / 35mm F1.4', aperture: 'F/8.0', shutter: '1/500s', iso: 'ISO 200', date: '2024.05.27' }
  },
  {
    id: 'p60',
    category: 'exposure',
    photoId: '1513635269975-59663e0ac1ad',
    title: '黑白切片 #6',
    width: 1200, height: 800,
    mono: true,
    exif: { camera: 'Canon R5 / 24-70mm F2.8', aperture: 'F/5.6', shutter: '1/320s', iso: 'ISO 200', date: '2024.05.14' }
  },
  {
    id: 'p61',
    category: 'frame',
    subcategory: 'frame.narrative',
    photoId: '1526481280693-3bfa7568e0f3',
    title: '黑白切片 #7',
    width: 1200, height: 800,
    mono: true,
    exif: { camera: 'Leica M11 / 50mm F2', aperture: 'F/2.8', shutter: '1/125s', iso: 'ISO 800', date: '2024.04.30' }
  }
]

/**
 * 构造 Unsplash CDN URL
 * - 普通：质量 80，宽度 800
 * - 缩略：质量 70，宽度 400
 * - 灯箱原图：质量 85，宽度 1600
 * - mono: true 时追加 sat=-100，输出黑白效果
 */
function unsplashUrl(photoId, { width = 800, quality = 80, mono = false } = {}) {
  const url = `https://images.unsplash.com/photo-${photoId}?w=${width}&q=${quality}&auto=format&fit=crop`
  return mono ? `${url}&sat=-100` : url
}

export { PHOTOS, PHOTO_CATEGORIES, unsplashUrl }
