import { useState, useRef } from 'react'

export default function useSwappingLine({ dropLineRef, swapLine }) {
  const dragStartElementHeightRef = useRef()
  const [dragStartIndex, setDragStartIndex] = useState()

  function handleDragStart(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    dragStartElementHeightRef.current = e.currentTarget.clientHeight
    setDragStartIndex(index)
  }

  function handleDragEnd() {
    setDragStartIndex()
    removeDropLine()
  }

  function handleDragOver(currentIndexRef, targetIndex, e) {
    removeDropLine()

    if (currentIndexRef.current === targetIndex) return
    if (currentIndexRef.current - 1 === targetIndex) return

    dropLineRef.current.style.height = dragStartElementHeightRef.current + 'px'

    // 対象行の中の最後の要素として空行を追加する
    e.currentTarget.appendChild(dropLineRef.current)
  }

  function handleDrop(currentIndex, targetIndex) {
    removeDropLine()
    swapLine(currentIndex, targetIndex)
  }

  function handleChildDrop(targetIndex) {
    removeDropLine()
    swapLine(dragStartIndex, targetIndex)
  }

  function removeDropLine() {
    if (!dropLineRef.current) return
    dropLineRef.current.remove()
  }


  return { dragStartIndex, handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleChildDrop }
}