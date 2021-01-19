/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'

let isDragging = false
//let targetElement

export default function DragSwappable({ children, className, onSwap }) {
  const [targetIndex, setTargetIndex] = useState()

  function handleMouseDown(e) {
    isDragging = true
    setTargetIndex(parseInt(e.target.dataset.index))
    //    e.target.style.display = 'none'
    //    children.splice(targetIndex, 1)
    // keyを取得してchildrenを保持する
    //    targetElement = e.target
    //    console.log('handleMouseDown')
    // 自分をchildrenから消してプレースホルダを表示
  }

  function handleMouseMove(e)  {
    if (!isDragging) return
    // なんかでかいI棒を表示する？
    //    console.log(targetElement)
    //    console.log('handleMouseMove')
  }

  function handleMouseUp(e) {
    if (!isDragging) return
    console.log('mouseup')
    isDragging = false
    setTargetIndex()
    //     targetIndex へ
    //    console.log('handleMouseUp')
    // onSwap
  }

  function handleDrop(e) {
    if (!isDragging) return
    console.log('ondrop')
    console.log(e)
  }

  return (
    <div className={className}>
      {children.map((c, i) => {
        // 見えないseparatorがいるとか。
        return(
          <div key={i} data-index={i} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onDrop={handleDrop} css={i === targetIndex && selectedStyle}>
            {c}
          </div>
        )
      })}
    </div>
  )
}

const selectedStyle = css({
  opacity: 0.5,
})

// user-drag: none;