import React, { useRef } from 'react'

const DragSwappable = React.forwardRef(function dragSwappable({ children, className, onSwap, direction='horizontal' }, ref) {
  const indexRef = useRef()

  function handleDragStart(e) {
    indexRef.current = parseInt(e.currentTarget.dataset.index)
  }

  function handleDragOver(e) {
    const targetIndex = parseInt(e.currentTarget.dataset.index)

    if (targetIndex === indexRef.current) {
      return // 自分自身へのドラッグでは何も反応させない
    }

    const isBeginside = (direction === 'horizontal') ?
      e.currentTarget.clientWidth / 2 < e.nativeEvent.offsetX :
      e.currentTarget.clientHeight / 2 < e.nativeEvent.offsetY

    if (indexRef.current - 1 === targetIndex && isBeginside) {
      return // 左隣の要素の右半分、または直上の要素の下半分では何も反応させない
    }

    if (indexRef.current + 1 === targetIndex && !isBeginside) {
      return // 右隣の要素の左半分、または直下の要素の上半分では何も反応させない
    }

    onSwap(indexRef.current, targetIndex)

    indexRef.current = targetIndex
  }

  return (
    <div className={className} ref={ref}>
      {children.map((c, i) => (
        <div key={i} data-index={i} onDragStart={handleDragStart} onDragOver={handleDragOver}>
          {c}
        </div>
      ))}
    </div>
  )
})

export default DragSwappable