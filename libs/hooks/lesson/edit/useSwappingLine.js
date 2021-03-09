import { useState, useRef } from 'react'
// import { inRange } from '../../../utils'

export default function useSwappingLine({ blankLineRef, swapLine }) {
  const dragStartElementHeightRef = useRef()
  const [dragStartIndex, setDragStartIndex] = useState()

  function handleDragStart(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    dragStartElementHeightRef.current = e.currentTarget.clientHeight
    setDragStartIndex(index)
  }

  function handleDragEnd() {
    setDragStartIndex()
    removeBlankLine()
  }

  function handleDragOver(currentIndexRef, targetIndex, e) {
    removeBlankLine()

    if (currentIndexRef.current === targetIndex) return
    if (currentIndexRef.current + 1 === targetIndex) return

    blankLineRef.current.style.height = dragStartElementHeightRef.current + 'px'

    // 対象行の中の最初の要素として空行を追加する
    e.currentTarget.insertBefore(blankLineRef.current, e.currentTarget.firstElementChild)
  }

  function handleDrop(currentIndex, targetIndex) {
    removeBlankLine()
    swapLine(currentIndex, targetIndex)
  }

  function handleChildDrop(targetIndex) {
    removeBlankLine()
    swapLine(dragStartIndex, targetIndex)
  }

  function removeBlankLine() {
    if (!blankLineRef.current) return
    blankLineRef.current.remove()
  }


  return { dragStartIndex, handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleChildDrop }
}