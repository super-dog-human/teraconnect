import { useRef, useEffect } from 'react'
import useFetch from '../../useFetch'
import { putFile } from '../../../fetch'
import { generateRandomID } from '../../../utils'
import { filterAvailableImages, isAvailableFileSize, imageToThumbnailURL, requestNewGraphicsBody } from '../../../graphicUtils'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'

const maxThumbnailSize = { width: 150, height: 95 }

export default function useImageUploaderBar(lessonID, images, setImages, inputFileRef, selectImageBarRef) {
  const imageCountRef = useRef(0)
  const { showError } = useErrorDialogContext()
  const { post } = useFetch()

  function handleDrop(e) {
    uploadImages(e.dataTransfer.files)
  }

  function handleFileChange(e) {
    uploadImages(e.target.files)
    e.target.value = ''
  }

  function handleUploadButtonClick() {
    inputFileRef.current.click()
  }

  async function uploadImages(files) {
    const validFiles = filterAvailableImages(files).filter(f => isAvailableFileSize(f))
    const temporaryIDs = validFiles.map(() => generateRandomID())

    let loadedCount = 0
    validFiles.forEach((file, i) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e => {
        loadedCount += 1
        const maxSize =  { width: maxThumbnailSize.width * window.devicePixelRatio, height: maxThumbnailSize.height * window.devicePixelRatio }
        imageToThumbnailURL(e.target.result, maxSize, (imageDataURL => {
          setImages(images =>
            [...images, {
              src: e.target.result,
              thumbnail: imageDataURL,
              id: temporaryIDs[i],
              isUploading: true,
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
    const body = requestNewGraphicsBody(parseInt(lessonID), validFiles)
    post('/graphics', body).then(results => {
      results.signedURLs.forEach((r, i) => {
        const tmpID = temporaryIDs[i]
        uploadImage(validFiles[i], tmpID, r.fileID, r.signedURL)
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

  async function uploadImage(file, tmpID, imageID, url) {
    await putFile(url, file, file.type).then(() => {
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
      showError({
        message: `ファイル「${file.name}」のアップロードに失敗しました。`,
        original: e,
        canDismiss: true,
        dismissCallback: () => { setImages(images => images.filter(i => i.id != tmpID)) },
        callback: () => { uploadImage(file, tmpID, imageID, url) },
      })
      console.error(e)
    })
  }

  useEffect(() => {
    if (imageCountRef.current < images.length) {
      selectImageBarRef.current.scrollLeft = selectImageBarRef.current.scrollWidth - selectImageBarRef.current.clientWidth
    }
    imageCountRef.current = images.length
  }, [images])

  return { handleDrop, handleFileChange, handleUploadButtonClick }
}