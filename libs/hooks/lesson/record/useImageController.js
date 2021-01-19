import { useState, useEffect } from 'react'

export default function useImageController(setSelectedImage, setRecord) {
  const [isShow, setIsShow] = useState(false)
  const [index, setIndex] = useState()
  const [images, setImages] = useState([])

  function setImageIndex(e) {
    const newIndex = parseInt(e.target.dataset.index)
    if (index === newIndex && isShow) {
      setRecord({ hideImage: 'foo-image-id' })
      setIsShow(false)
      setIndex()
    } else {
      setRecord({ showImage: 'foo-image-id' })
      setIsShow(true)
      setIndex(newIndex)
    }
  }

  function moveImage(e) {
    console.log('画像をいれかえる？', e)
    // imagesのarrayを入れ替える
  }

  useEffect(() => {
    setSelectedImage(images[index])
  }, [index])

  return { imageIndex: index, setImageIndex, images, setImages, moveImage }
}