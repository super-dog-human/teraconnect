import { TEN_MB as maxFileByteSize, SUPPORTED_IMAGE_FILES } from './constants'
import { extentionNameTo3Chars } from './utils'

export function filterAvailableImages(files) {
  return Array.from(files)
    .filter(f => SUPPORTED_IMAGE_FILES.split(',').includes(f.type))
    .filter(f => f.size <= maxFileByteSize)
}

export function imageToThumbnailURL(original, maxSize, callback) {
  const image = new Image()
  image.crossOrigin = 'Anonymous'
  image.onload = (() => {
    const ratio = Math.min(maxSize.width / image.naturalWidth, maxSize.height / image.naturalHeight)
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

export function dataURLToBlob(url, type) {
  const byteString = window.atob(url.split(',')[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type })
}

export function isPublicThumbnail(url) {
  return url.startsWith(process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL)
}

export function requestNewGraphicsBody(lessonID, files) {
  const fileRequests = files.map(file => {
    return {
      entity: 'graphic',
      extension: extentionNameTo3Chars(file.type.substr(6)),
      contentType: file.type
    }
  })

  return { lessonID, fileRequests }
}