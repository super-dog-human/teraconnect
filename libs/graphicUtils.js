import { TEN_MB as maxFileByteSize } from './constants'
const maxThumbnailSize = { width: 150, height: 95 }

export function filterAvailableImages(files) {
  return Array.from(files)
    .filter(f => ['image/jpeg', 'image/png', 'image/gif'].includes(f.type))
    .filter(f => f.size <= maxFileByteSize)
}

export function imageToThumbnailURL(original, callback) {
  const image = new Image()
  image.src = original
  image.onload = (async () => {
    const ratio = Math.min(maxThumbnailSize.width / image.naturalWidth, maxThumbnailSize.height / image.naturalHeight) * window.devicePixelRatio
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const width = image.naturalWidth * ratio
    const height = image.naturalHeight * ratio

    canvas.width = width
    canvas.height = height

    ctx.drawImage(image, 0, 0, width, height)
    await callback(canvas.toDataURL())
  })
}

export function isAvailableFileSize(file) {
  return file.size <= maxFileByteSize
}