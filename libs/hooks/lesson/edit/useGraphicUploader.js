import { useEffect, useRef } from 'react'
import useFetch from '../../useFetch'
import { putFile } from '../../../fetch'
import { useRouter } from 'next/router'
import { generateRandomID } from '../../../utils'
import { filterAvailableImages, isAvailableFileSize, imageToThumbnailURL } from '../../../graphicUtils'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'

const maxThumbnailSize = { width: 150, height: 95 }

export default function useGraphicUploader({ graphicURLs, setGraphicURLs }) {
  const router = useRouter()
  const hasAddedRef = useRef(false)
  const graphicCountRef = useRef(Object.keys(graphicURLs).length)
  const graphicContainerRef = useRef()
  const inputMultiFileRef = useRef()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const { createGraphics } = useFetch()
  const { showError } = useErrorDialogContext()

  function handleUploadButtonClick() {
    inputMultiFileRef.current.click()
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    uploadNewGraphics(e.dataTransfer.files)
    e.preventDefault()
  }

  function handleFileChange(e) {
    uploadNewGraphics(e.target.files)
    e.target.value = ''
  }

  function uploadNewGraphics(files){
    const validFiles = filterAvailableImages(files).filter(f => isAvailableFileSize(f))
    const fileLength = validFiles.length

    if (fileLength === 0)  return

    hasAddedRef.current = true

    const tempIDs = validFiles.map(() => generateRandomID())
    setGraphicURLs(urls => {
      tempIDs.forEach(id => {
        urls[id] = { url: null, isUploading: true }
      })
      return { ...urls }
    })

    createNewGraphic(lessonIDRef.current, validFiles, tempIDs)
  }

  function createNewGraphic(lessonID, files, tempIDs) {
    createGraphics(lessonID, files).then(result => {
      uploadAndSetGraphics(files, tempIDs, result.signedURLs)
    }).catch(e => {
      showError({
        message: '画像の作成に失敗しました。',
        original: e,
        canDismiss: true,
        callback: () => {
          createNewGraphic(lessonID, files, tempIDs)
        },
        dismissCallback: () => {
          setGraphicURLs(urls => {
            tempIDs.forEach(id => delete urls[id])
            return { ...urls }
          })
        },
      })
    })
  }

  function uploadAndSetGraphics(files, tempIDs, newGraphics) {
    files.forEach((file, i) => {
      const tempID = tempIDs[i]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e => {
        const originalDataURL = e.target.result
        imageToThumbnailURL(originalDataURL, maxThumbnailSize, thumbnailDataURL => {
          setGraphicURLs(urls => {
            urls[tempID].url = thumbnailDataURL
            return { ...urls }
          })

          const newGraphic = newGraphics[i]
          uploadGraphic(newGraphic.signedURL, newGraphic.fileID, tempID, file, originalDataURL)
        })
      })
    })
  }

  function uploadGraphic(url, graphicID, tempID, file, imageDataURL) {
    putFile(url, file, file.type).then(() => {
      setGraphicURLs(urls => {
        const newURLs = {}
        Object.keys(urls).forEach(id => {
          if (id === tempID) {
            newURLs[graphicID] = {
              url: imageDataURL,
              isUploading: false,
            }
          } else {
            newURLs[id] = urls[id] // 順番維持のため元の画像も再格納
          }
        })
        return newURLs
      })
    }).catch(e => {
      showError({
        message: '画像のアップロードに失敗しました。',
        original: e,
        canDismiss: true,
        callback: () => {
          uploadGraphic(url, graphicID, tempID, file, imageDataURL)
        },
        dismissCallback: () => {
          // 作成済みのGraphicがサーバーに残るのでリロードすると空画像が出現するが、手動で削除可能なので許容する
          setGraphicURLs(urls => {
            delete urls[tempID]
            return { ...urls }
          })
        },
      })
    })
  }

  useEffect(() => {
    if (!hasAddedRef.current) return

    const graphicCount = Object.keys(graphicURLs).length
    if (graphicCountRef.current < graphicCount) {
      graphicContainerRef.current.scrollTop = graphicContainerRef.current.scrollHeight
    }
    graphicCountRef.current = graphicCount
  }, [graphicURLs])

  return { graphicContainerRef, inputMultiFileRef, handleFileChange, handleUploadButtonClick, handleDragOver, handleDrop }
}