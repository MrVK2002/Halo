import { ref } from 'vue'
import PhotoSwipe from 'photoswipe'
import { unsplashUrl } from '@/data/photos.js'

/**
 * Lightbox（基于 PhotoSwipe v5）composable
 * - 支持 EXIF 信息栏
 * - 信息栏固定在视口底部（PSW 默认）
 * - 自定义皮肤：所有圆角归零
 */
export function useLightbox() {
  const pswpEl = ref(null)
  let instance = null

  function open(index, items) {
    if (instance) {
      instance.destroy()
      instance = null
    }

    const dataSource = items.map((it) => ({
      src: it.lightbox.src,
      msrc: it.src,
      w: it.lightbox.width,
      h: it.lightbox.height,
      title: it.lightbox.title,
      alt: it.alt,
      // 自定义字段会被 PhotoSwipe 忽略，挂在 exif 上传到 captionEl
      exif: it.lightbox.exif
    }))

    instance = new PhotoSwipe({
      dataSource,
      index,
      bgOpacity: 0.96,
      showHideAnimationType: 'zoom',
      zoomAnimationDuration: 320,
      padding: { top: 24, bottom: 96, left: 24, right: 24 },
      arrowKeys: true,
      // 自定义 caption 渲染：展示 EXIF 信息栏
      addCaptionHTMLFn: (item, altEl, captionEl) => {
        const exif = item.exif
        if (!exif) {
          captionEl.children[0].innerHTML = ''
          captionEl.children[0].appendChild(altEl)
          return false
        }
        // 标题
        const title = document.createElement('div')
        title.className = 'pswp-caption-title'
        title.textContent = item.title || item.alt || ''

        // EXIF 字段行
        const row = document.createElement('div')
        row.className = 'pswp-caption-exif'
        const fields = [
          exif.camera,
          exif.aperture,
          exif.shutter,
          exif.iso,
          exif.date
        ].filter(Boolean)
        row.textContent = fields.join('  ·  ')

        captionEl.children[0].innerHTML = ''
        captionEl.children[0].appendChild(title)
        captionEl.children[0].appendChild(row)
        return true
      }
    })

    instance.init()
  }

  function close() {
    if (instance) {
      instance.close()
    }
  }

  return { pswpEl, open, close }
}
