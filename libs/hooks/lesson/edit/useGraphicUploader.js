import { useRef } from 'react'
import useFetch from '../../useFetch'
import { useRouter } from 'next/router'
import { generateRandomID } from '../../../utils'
import { filterAvailableImages, isAvailableFileSize, imageToThumbnailURL } from '../../../graphicUtils'

export default function useGraphicUploader({ setGraphicURLs }) {
  const router = useRouter()
  const inputMultiFileRef = useRef()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const { createGraphics, putFile } = useFetch()

  function handleUploadButtonClick() {
    inputMultiFileRef.current.click()
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    uploadGraphic(e.dataTransfer.files)
    e.preventDefault()
  }

  function handleFileChange(e) {
    uploadGraphic(e.target.files)
    e.target.value = ''
  }

  async function uploadGraphic(files){
    const validFiles = filterAvailableImages(files).filter(f => isAvailableFileSize(f))
    const fileLength = validFiles.length

    if (fileLength === 0)  return

    const tempIDs = validFiles.map(() => generateRandomID())
    setGraphicURLs(urls => {
      tempIDs.forEach(id => {
        urls[id] = { url: null, isUploading: true }
      })
      return { ...urls }
    })

    const newGraphics = (await createGraphics(lessonIDRef.current, validFiles)).signedURLs

    validFiles.forEach((file, i) => {
      const tmpID = tempIDs[i]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e => {
        imageToThumbnailURL(e.target.result, async (imageDataURL) => {
          setGraphicURLs(urls => {
            urls[tmpID].url = imageDataURL
            return { ...urls }
          })

          const newGraphic = newGraphics[i]
          await putFile(newGraphic.signedURL, file, file.type)

          setGraphicURLs(urls => {
            const newURLs = {}
            Object.keys(urls).forEach(id => {
              if (id === tmpID) {
                newURLs[newGraphic.fileID] = {
                  url: e.target.result,
                  isUploading: false,
                }
              } else {
                newURLs[id] = urls[id] // 順番維持のため元の画像も再格納
              }
            })
            return newURLs
          })
        })
      })
    })
  }

  return { inputMultiFileRef, handleFileChange, handleUploadButtonClick, handleDragOver, handleDrop }
}