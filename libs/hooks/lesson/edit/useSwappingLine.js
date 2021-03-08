import { useState, useRef } from 'react'
// import { inRange } from '../../../utils'

export default function useSwappingLine() {
  const startLineOffsetRef = useRef(false)
  const [focusedIndex, setFocusedIndex] = useState()
  const blankLineRef = useRef()

  function handleDragStart(e) {
    startLineOffsetRef.current =  e.nativeEvent.offsetY
    const index = parseInt(e.currentTarget.dataset.index)
    setFocusedIndex(index)
  }

  function handleDragEnd() {
    setFocusedIndex()
    removeBlankLine()
  }

  function handleDragOver(currentIndexRef, targetIndex, e) {
    removeBlankLine()

    if (currentIndexRef.current === targetIndex) return

    const blankLine = document.createElement('div')
    blankLine.dataset.index = 'blank'
    blankLine.style.height = '100px'
    const body = document.createElement('div')
    body.style['background-color'] = 'var(--dark-purple)'
    body.style.width = '100%'
    body.style.height = '100%'
    body.style['border-radius'] = '5px'
    blankLine.append(body)

    blankLineRef.current = blankLine
    if (currentIndexRef.current - 1 === targetIndex) {
      e.currentTarget.before(blankLineRef.current)
    } else {
      e.currentTarget.after(blankLineRef.current)
    }
  }

  function handleDrop(currentIndex, targetIndex) {
    removeBlankLine()
  }

  function removeBlankLine() {
    if (!blankLineRef.current) return
    blankLineRef.current.remove()
  }

  function deleteLine() {

  }

  return { focusedIndex, handleDragStart, handleDragEnd, handleDragOver, handleDrop }
}