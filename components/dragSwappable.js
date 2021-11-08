import React, { useRef } from 'react'

export default function DragSwappable({ children, onDragOver }) {
  const indexRef = useRef()
  const prevTargetRef = useRef()

  function handleDragStart(e) {
    indexRef.current = targetIndex(e)
  }

  function handleDragOver(e) {
    e.preventDefault() // onDrop発火のために必要

    const currentIndex = targetIndex(e)
    if (prevTargetRef.current === currentIndex) return
    prevTargetRef.current = currentIndex

    if (!onDragOver) return
    onDragOver(indexRef, currentIndex, e)

    indexRef.current = currentIndex
  }

  function targetIndex(e) {
    return parseInt(e.currentTarget.dataset.index)
  }

  return (
    <>
      {children.map((c, i) => (
        <div key={i} data-index={i} onDragStart={handleDragStart} onDragOver={handleDragOver} draggable={true}>
          {c}
        </div>
      ))}
    </>
  )
}