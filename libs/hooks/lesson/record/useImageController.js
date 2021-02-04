import { useState, useEffect } from 'react'
import { useLessonRecorderContext } from '../../../contexts/lessonRecorderContext'

export default function useImageController(setSelectedImage) {
  const [isShow, setIsShow] = useState(false)
  const [imageID, setImageID] = useState()
  const [images, setImages] = useState([])
  const { setRecord } = useLessonRecorderContext()

  function selectImage(e) {
    const newImageID = e.target.dataset.id
    if (imageID === newImageID && isShow) {
      setRecord({ hideImage: newImageID })
      setIsShow(false)
      setImageID()
    } else {
      setRecord({ showImage: newImageID })
      setIsShow(true)
      setImageID(newImageID)
    }
  }

  function removeImage (e) {
    const targetImageID = e.currentTarget.dataset.id
    if (imageID === targetImageID && isShow) {
      setRecord({ hideImage: targetImageID })
      setRecord({ removeImage: targetImageID })
      setIsShow(false)
      setImageID()
    }

    setImages(images.filter(i => i.id != targetImageID))
  }

  function moveImage(fromIndex, toIndex) {
    if (fromIndex === toIndex) return

    const newImages = [...images]
    const target = newImages.splice(fromIndex, 1)[0]
    newImages.splice(toIndex, 0, target)

    setImages(newImages)
  }

  useEffect(() => {
    setSelectedImage(images.find(i => i.id === imageID))
  }, [imageID])

  return { imageID, selectImage, removeImage, images, setImages, moveImage }
}