import { useState } from 'react'

export default function useDragOverDetector() {
  const [hasDragOver, setHasDragOver] = useState(false)

  function handleAreaDragOver(e) {
    setHasDragOver(true)
    e.preventDefault() // これがないとonDrop時にブラウザがファイルドロップを受けて別ウィンドウで開いてしまう
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