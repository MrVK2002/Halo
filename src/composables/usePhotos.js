import { ref, computed } from 'vue'
import { PHOTOS, PHOTO_CATEGORIES, unsplashUrl } from '@/data/photos.js'

/**
 * 照片数据 + 分类筛选 composable
 */
export function usePhotos() {
  const activeCategory = ref('all')

  const counts = computed(() => {
    const map = { all: PHOTOS.length }
    for (const p of PHOTOS) {
      map[p.category] = (map[p.category] || 0) + 1
      if (p.subcategory) {
        map[p.subcategory] = (map[p.subcategory] || 0) + 1
      }
    }
    return map
  })

  const filteredPhotos = computed(() => {
    if (activeCategory.value === 'all') return PHOTOS
    return PHOTOS.filter((p) =>
      p.category === activeCategory.value ||
      p.subcategory === activeCategory.value
    )
  })

  /**
   * 转成 Masonry 库需要的 items 格式
   * - src: 缩略图 URL（用于瀑布流）
   * - lightbox: 灯箱需要的全字段
   */
  const masonryItems = computed(() =>
    filteredPhotos.value.map((p) => ({
      id: p.id,
      src: unsplashUrl(p.photoId, { width: 800, quality: 80 }),
      thumb: unsplashUrl(p.photoId, { width: 400, quality: 70 }),
      width: p.width,
      height: p.height,
      alt: p.title,
      lightbox: {
        src: unsplashUrl(p.photoId, { width: 1600, quality: 85 }),
        width: p.width,
        height: p.height,
        title: p.title,
        exif: p.exif
      }
    }))
  )

  function setCategory(key) {
    activeCategory.value = key
  }

  return {
    categories: PHOTO_CATEGORIES,
    activeCategory,
    counts,
    filteredPhotos,
    masonryItems,
    setCategory
  }
}
