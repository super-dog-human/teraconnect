import { TEN_MB as maxFileByteSize } from './constants'

export function filterAvailableImages(files) {
  return Array.from(files)
    .filter(f => ['image/jpeg', 'image/png', 'image/gif'].includes(f.type))
    .filter(f => f.size <= maxFileByteSize)
}

export function imageToThumbnailURL(original, maxSize, callback) {
  const image = new Image()
  image.onload = (() => {
    const ratio = Math.min(maxSize.width / image.naturalWidth, maxSize.height / image.naturalHeight) * window.devicePixelRatio
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const width = image.naturalWidth * ratio
    const height = image.naturalHeight * ratio

    canvas.width = width
    canvas.height = height

    ctx.drawImage(image, 0, 0, width, height)
    callback(canvas.toDataURL('image/png'))
  })
  image.src = original
}

export function isAvailableFileSize(file) {
  return file.size <= maxFileByteSize
}