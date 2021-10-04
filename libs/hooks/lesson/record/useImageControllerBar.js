import { useState, useCallback, useEffect } from 'react'
import { useLessonRecorderContext } from '../../../contexts/lessonRecorderContext'

export default function useImageControllerBar({ initialGraphics, setSelectedGraphic }) {
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

  function moveImage(fromIndexRef, toIndex) {
    const fromIndex = fromIndexRef.current
    if (fromIndex === toIndex) return

    setImages(images => {
      const target = images.splice(fromIndex, 1)[0]
      images.splice(toIndex, 0, target)
      return images
    })
  }

  const setInitialGraphics = useCallback(() => {
    // idは一時的にランダム文字列になることがあるのでstringで統一する
    setImages(initialGraphics.map(g => ({ src: g.url, thumbnail: g.url, id: g.id.toString() })))
  }, [initialGraphics])

  useEffect(() => {
    if (initialGraphics.length === 0) return
    setInitialGraphics()
  }, [initialGraphics, setInitialGraphics])

  useEffect(() => {
    if (images.length === 0) return
    setSelectedGraphic(images.find(i => i.id === imageID))
  }, [images, imageID, setSelectedGraphic])

  return { imageID, selectImage, removeImage, images, setImages, moveImage }
}