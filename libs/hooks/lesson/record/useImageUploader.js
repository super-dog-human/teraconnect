import { useEffect } from 'react'
import { post, putFile } from '../../../fetch'
import { extentionNameTo3Chars } from '../../../utils'

const maxFileByteSize = 10485760 // 10MB
const thumbnailMaxSize = { width: 150, height: 95 }
let imageCount = 0

export default function useImageUploader(id, token, images, setImages, inputFileRef, selectImageBarRef) {
  function handleDrop(e) {
    uploadImages(e.dataTransfer.files)
  }

  function handleChangeFile(e) {
    uploadImages(e.target.files)
    e.target.value = ''
  }

  function handleUploadButtonClick() {
    inputFileRef.current.click()
  }

  async function uploadImages(files) {
    const validFiles = Array.from(files)
      .filter(f => ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(f.type))
      .filter(f => f.size <= maxFileByteSize)

    const temporaryIDs = validFiles.map(() => Math.random().toString(32).substring(2))

    let loadedCount = 0
    validFiles.forEach((file, i) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (async e => {
        loadedCount += 1
        resizedImageDataURL(e.target.result, (imageDataURL => {
          setImages(images =>
            [...images, {
              src: e.target.result,
              thumbnail: imageDataURL,
              id: temporaryIDs[i],
              isUploading: true,
              isError: false,
            }]
          )
        }))

        if (loadedCount === validFiles.length) { // 画像を全て読み込んでサムネイルを表示した後、1回のリクエストで全枚数分の署名付きURLを取得
          (await fetchSignedURLs(validFiles)).forEach((r, i) => {
            uploadImage(validFiles[i], temporaryIDs[i], r.fileID, r.signedURL)
          })
        }
      })
    })
  }

  async function fetchSignedURLs(files) {
    const requests = files.map(file => {
      return {
        entity: 'graphic',
        extension: extentionNameTo3Chars(file.type.substr(6)),
        contentType: file.type
      }
    })

    const request = { lessonID: id, fileRequests: requests }
    const result = await post('/graphics', request, token)
    return result.signedURLs
  }

  function resizedImageDataURL(original, callback) {
    const image = new Image()
    image.src = original
    image.onload = (() => {
      const ratio = Math.min(thumbnailMaxSize.width / image.naturalWidth, thumbnailMaxSize.height / image.naturalHeight) * window.devicePixelRatio
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const width = image.naturalWidth * ratio
      const height = image.naturalHeight * ratio

      canvas.width = width
      canvas.height = height

      ctx.drawImage(image, 0, 0, width, height)
      callback(canvas.toDataURL())
    })
  }

  function uploadImage(file, tmpID, imageID, url) {
    putFile(url, file, file.type)
      .then(() => {
        setImages(images => {
          const newImages = [...images]
          const foundTarget = newImages.some(i => {
            if (i.id != tmpID) return false
            i.id = imageID
            i.isUploading = false
            return true
          })
          return foundTarget ? newImages : images
        })
      }).catch(e => {
        console.error(e)

        setImages(images => {
          const newImages = [...images]
          const foundTarget = newImages.some(i => {
            if (i.id != tmpID) return false
            i.id = imageID
            i.isUploading = false
            i.isError = true
            return true
          })
          return foundTarget ? newImages : images
        })
      })
  }

  useEffect(() => {
    if (imageCount < images.length) {
      selectImageBarRef.current.scrollLeft = selectImageBarRef.current.scrollWidth - selectImageBarRef.current.clientWidth
    }
    imageCount = images.length
  }, [images])

  return { handleDrop, handleChangeFile, handleUploadButtonClick }
}