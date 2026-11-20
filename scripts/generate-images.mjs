/**
 * 批量生成作品集图片的多尺寸 WebP
 * ------------------------------------------------------------
 * 源图目录：public/images/portfolio/**（只放原图 png / jpg / jpeg / webp）
 * 输出目录：public/images/portfolio-optimized/**（保持分类子目录结构）
 * 命名：{slug}-400.webp / -800.webp / -1600.webp
 * - 自动按 EXIF 摆正方向
 * - 只缩小不放大（withoutEnlargement），避免小图被拉糊
 * - 质量 76，肉眼基本无损；已是生成产物的文件会被跳过
 *
 * 用法：npm run images
 */
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_ROOT = path.resolve('public/images/portfolio')
const OUT_ROOT = path.resolve('public/images/portfolio-optimized')
const WIDTHS = [400, 800, 1600]
const QUALITY = 76
const SOURCE_RE = /\.(png|jpe?g|webp)$/i
const GENERATED_RE = /-\d+\.webp$/i

/** 文件名转 slug：小写、非字母数字转连字符 */
function slugify(fileName) {
  return path
    .parse(fileName)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** 递归收集源图片，跳过已生成的尺寸文件 */
async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collect(full)))
    } else if (SOURCE_RE.test(entry.name) && !GENERATED_RE.test(entry.name)) {
      files.push(full)
    }
  }

  return files
}

async function main() {
  const files = await collect(SRC_ROOT)
  if (!files.length) {
    console.log('未找到源图片：', SRC_ROOT)
    return
  }

  let totalBytes = 0

  for (const file of files) {
    const relDir = path.relative(SRC_ROOT, path.dirname(file))
    const outDir = path.join(OUT_ROOT, relDir)
    const slug = slugify(path.basename(file))

    await mkdir(outDir, { recursive: true })

    for (const width of WIDTHS) {
      const out = path.join(outDir, `${slug}-${width}.webp`)
      const info = await sharp(file)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out)

      totalBytes += info.size
      console.log(
        `${path.relative(OUT_ROOT, out)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`
      )
    }
  }

  console.log(
    `\n完成：${files.length} 张源图 → ${files.length * WIDTHS.length} 个文件，合计 ${(
      totalBytes / 1024 / 1024
    ).toFixed(1)} MB`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
