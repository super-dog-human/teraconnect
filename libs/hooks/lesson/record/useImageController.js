import { useState, useEffect } from 'react'

export default function useImageController(setSelectedImage, setRecord) {
  const [isShow, setIsShow] = useState(false)
  const [imageID, setImageID] = useState()
  const [images, setImages] = useState([])

  function handleMouseOver(e) {
    // onAnimationEnd
  }

  function selectImage(e) {
    const newImageID = e.target.dataset.id
    if (imageID === newImageID && isShow) {
      setRecord({ hideImage: 'foo-image-id' })
      setIsShow(false)
      setImageID()
    } else {
      setRecord({ showImage: 'foo-image-id' })
      setIsShow(true)
      setImageID(newImageID)
    }
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

  return { imageID, selectImage, images, setImages, moveImage }
}