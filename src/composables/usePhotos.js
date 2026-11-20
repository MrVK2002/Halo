import { ref, computed } from 'vue'
import { PHOTOS, PHOTO_CATEGORIES } from '@/data/photos.js'

/** 单批加载数量：兼顾首屏填充速度与滚动加载节奏 */
const PAGE_SIZE = 9

/**
 * 照片数据 + 分类筛选 + 分批加载 composable
 */
export function usePhotos() {
  const activeCategory = ref('all')
  /** 当前分类下已加载到的条数（滚动触底后递增） */
  const visibleCount = ref(PAGE_SIZE)

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

  /** 当前已加载的照片（分页切片） */
  const visiblePhotos = computed(() => filteredPhotos.value.slice(0, visibleCount.value))

  /** 是否还有未加载的照片 */
  const hasMore = computed(() => visibleCount.value < filteredPhotos.value.length)

  /**
   * 触发下一批加载；已全部加载时返回 false，便于调用方停止监听
   */
  function loadMore() {
    if (!hasMore.value) return false
    visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, filteredPhotos.value.length)
    return true
  }

  /**
   * 转成 Masonry 需要的 items 格式
   * - src: 瀑布流展示图（800w 本地 WebP）
   * - thumb: 缩略图（400w）
   * - placeholder: 24px 模糊占位图（base64，避免额外请求）
   * - lightbox: 灯箱所需的大图（1600w）与 EXIF
   */
  const masonryItems = computed(() =>
    visiblePhotos.value.map((p) => ({
      id: p.id,
      src: p.img.display,
      thumb: p.img.thumb,
      placeholder: p.img.placeholder,
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
    // 切换分类时重置分页，从第一批重新开始
    visibleCount.value = PAGE_SIZE
  }

  return {
    categories: PHOTO_CATEGORIES,
    activeCategory,
    counts,
    filteredPhotos,
    visiblePhotos,
    masonryItems,
    hasMore,
    loadMore,
    setCategory
  }
}
