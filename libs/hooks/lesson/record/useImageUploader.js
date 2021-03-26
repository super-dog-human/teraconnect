import { useRef, useEffect } from 'react'
import { post, putFile } from '../../../fetch'
import { extentionNameTo3Chars } from '../../../utils'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'

const maxFileByteSize = 10485760 // 10MB
const thumbnailMaxSize = { width: 150, height: 95 }

export default function useImageUploader(id, images, setImages, inputFileRef, selectImageBarRef) {
  const imageCountRef = useRef(0)
  const { showError } = useErrorDialogContext()

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
      .filter(f => ['image/jpeg', 'image/png', 'image/gif'].includes(f.type))
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

        // 画像を全て読み込んでサムネイルを表示できたら、1回のリクエストで全枚数分の署名付きURLを取得し、アップロード
        if (loadedCount === validFiles.length) {
          fetchURLsAndUpload(validFiles, temporaryIDs)
        }
      })
    })
  }

  async function fetchURLsAndUpload(validFiles, temporaryIDs) {
    fetchSignedURLs(validFiles).then(responses =>  {
      responses.forEach((r, i) => {
        const tmpID = temporaryIDs[i]

        uploadImage(validFiles[i], tmpID, r.fileID, r.signedURL).catch(e => {
          showError({
            message: `ファイル「${validFiles[i].name}」のアップロードに失敗しました。`,
            original: e,
            canDismiss: true,
            dismissCallback: () => { setImages(images => images.filter(i => i.id != tmpID)) },
            callback: () => { uploadImage(validFiles[i], tmpID, r.fileID, r.signedURL) },
          })
          console.error(e)
        })
      })
    }).catch(e => {
      showError({
        message: '画像アップロードの準備に失敗しました。',
        original: e,
        canDismiss: true,
        dismissCallback: () => { setImages(images => images.slice(0, images.length - validFiles.length)) },
        callback: () => { fetchURLsAndUpload(validFiles, temporaryIDs) },
      })
      console.error(e)
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
    const result = await post('/graphics', request)
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

  async function uploadImage(file, tmpID, imageID, url) {
    await putFile(url, file, file.type)

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
  }

  useEffect(() => {
    if (imageCountRef.current < images.length) {
      selectImageBarRef.current.scrollLeft = selectImageBarRef.current.scrollWidth - selectImageBarRef.current.clientWidth
    }
    imageCountRef.current = images.length
  }, [images])

  return { handleDrop, handleChangeFile, handleUploadButtonClick }
}