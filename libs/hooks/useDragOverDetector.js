import { useState } from 'react'

export default function useDragOverDetector() {
  const [hasDragOver, setHasDragOver] = useState(false)

  function handleAreaDragOver(e) {
    setHasDragOver(true)
    e.preventDefault() // onDrop時にブラウザが別ウィンドウを開くのを防ぐ
  }

  function handleAreaDragLeave() {
    setHasDragOver(false)
  }

  function handleAreaDrop(e) {
    setHasDragOver(false)
    e.preventDefault()
  }

  return { hasDragOver, handleAreaDragOver, handleAreaDragLeave, handleAreaDrop }
}