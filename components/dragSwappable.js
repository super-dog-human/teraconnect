import React from 'react'

let isDragging = false
let currentIndex

export default function DragSwappable({ children, className, onSwap }) {
  function handleDragStart(e) {
    isDragging = true
    currentIndex = parseInt(e.currentTarget.dataset.index)
  }

  function handleDragOver(e) {
    const targetIndex = parseInt(e.currentTarget.dataset.index)

    if (targetIndex === currentIndex) {
      return // 自分自身へのドラッグでは何も反応させない
    }

    const isMoveLeft = e.currentTarget.clientWidth / 2 < e.nativeEvent.offsetX

    if (currentIndex - 1 === targetIndex && isMoveLeft) {
      return  // 左隣の要素の右半分では何も反応させない
    }

    if (currentIndex + 1 === targetIndex && !isMoveLeft) {
      return // 右隣の要素の左半分では何も反応させない
    }

    onSwap(currentIndex, targetIndex)

    currentIndex = targetIndex
  }

  function handleDragEnd() {
    if (!isDragging) return
    isDragging = false
  }

  function handleDrop() {
    if (!isDragging) return
    isDragging = false
  }

  return (
    <div className={className}>
      {children.map((c, i) => (
        <div key={i} data-index={i} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDrop={handleDrop}>
          {c}
        </div>
      ))}
    </div>
  )
}