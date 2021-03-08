import { useState, useEffect } from 'react'
import { useLessonRecorderContext } from '../../../contexts/lessonRecorderContext'

export default function useImageController(setSelectedGraphic) {
  const [isShow, setIsShow] = useState(false)
  const [imageID, setImageID] = useState()
  const [images, setImages] = useState([])
  const { setRecord } = useLessonRecorderContext()

  function selectImage(e) {
    const newImageID = e.target.dataset.id
    if (imageID === newImageID && isShow) {
      setRecord({ kind: 'graphic', action: 'hide', value: newImageID })
      setIsShow(false)
      setImageID()
    } else {
      setRecord({ kind: 'graphic', action: 'show', value: newImageID })
      setIsShow(true)
      setImageID(newImageID)
    }
  }

  function removeImage (e) {
    const targetImageID = e.currentTarget.dataset.id
    if (imageID === targetImageID && isShow) {
      setRecord({ kind: 'graphic', action: 'hide', value: targetImageID })
      setIsShow(false)
      setImageID()
    }

    setImages(images.filter(i => i.id != targetImageID))
  }

  function moveImage(fromIndexRef, toIndex, e) {
    const fromIndex = fromIndexRef.current
    if (fromIndex === toIndex) return

    const isBeginside = e.currentTarget.clientWidth / 2 < e.nativeEvent.offsetX
    if (fromIndexRef.current - 1 === toIndex && isBeginside) {
      return // 左隣の要素の右半分では何も反応させない
    }

    if (fromIndexRef.current + 1 === toIndex && !isBeginside) {
      return // 右隣の要素の左半分では何も反応させない
    }

    const newImages = [...images]
    const target = newImages.splice(fromIndex, 1)[0]
    newImages.splice(toIndex, 0, target)

    setImages(newImages)
    fromIndexRef.current = toIndex
  }

  useEffect(() => {
    setSelectedGraphic(images.find(i => i.id === imageID))
  }, [imageID])

  return { imageID, selectImage, removeImage, images, setImages, moveImage }
}