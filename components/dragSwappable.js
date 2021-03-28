import React, { useRef } from 'react'

export default function DragSwappable({ children, onDragStart, onDragOver, onDragEnd, onDrop }) {
  const indexRef = useRef()
  const prevTargetRef = useRef()

  function handleDragStart(e) {
    indexRef.current = targetIndex(e)

    if (!onDragStart) return
    onDragStart(e)
  }

  function handleDragOver(e) {
    e.preventDefault() // onDrop発火のために必要

    const currentIndex = targetIndex(e)
    if (prevTargetRef.current === currentIndex) return
    prevTargetRef.current = currentIndex

    if (!onDragOver) return

    onDragOver(indexRef, currentIndex, e)
  }

  function handleDragEnd(e) {
    if (!onDragEnd) return
    onDragEnd(e)
  }

  function handleDrop(e) {
    if (!onDrop) return

    onDrop(indexRef.current, targetIndex(e))
  }

  function targetIndex(e) {
    return parseInt(e.currentTarget.dataset.index)
  }

  return (
    <>
      {children.map((c, i) => (
        <div key={i} data-index={i} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDrop={handleDrop} draggable={true}>
          {c}
        </div>
      ))}
    </>
  )
}