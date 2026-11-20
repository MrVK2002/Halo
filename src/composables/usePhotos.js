import { ref, computed } from 'vue'
import { PHOTOS, PHOTO_CATEGORIES } from '@/data/photos.js'

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
   * - src: 瀑布流展示图（800w 本地 WebP）
   * - thumb: 缩略图（400w）
   * - lightbox: 灯箱所需的大图（1600w）与 EXIF
   */
  const masonryItems = computed(() =>
    filteredPhotos.value.map((p) => ({
      id: p.id,
      src: p.img.display,
      thumb: p.img.thumb,
      width: p.width,
      height: p.height,
      alt: p.title,
      lightbox: {
        src: p.img.full,
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
