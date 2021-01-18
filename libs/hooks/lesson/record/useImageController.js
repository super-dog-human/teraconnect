import { useState, useEffect } from 'react'

export default function useImageController(setRecord) {
  const [isShow, setIsShow] = useState(false)
  const [index, setIndex] = useState()
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState()

  function setImageIndex(e) {
    // indexが前と一緒ならhideとかそういう
    const show = !isShow
    setIsShow(show)
    if (show) {
      setRecord({ showImage: 'foo-image-id' })
      setIndex(parseInt(e.target.dataset.index))
    } else {
      setRecord({ hideImage: 'foo-image-id' })
      setIndex()
    }
  }

  function moveImage(e) {
    // dropされた画像
    console.log('画像をいれかえる？', e)
  }

  useEffect(() => {
    setSelectedImage(images[index])
  }, [index])

  return { setImageIndex, images, setImages, selectedImage, moveImage }
}