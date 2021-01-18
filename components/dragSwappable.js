import React from 'react'

export default function DragSwappable({ children, onSwap }) {
  function handleMouseDown(e) {
    // 今つかんでいるimgのidかkeyを持っておく
    console.log('handleMouseDown')
  }

  function handleMouseMove(e) {
    console.log('handleMouseMove')
  }

  function handleMouseUp(e) {
    console.log('handleMouseUp')
    // onSwap
  }

  return (
    <>
      {children.map((c, i) => {
        return (
          <div key={i} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>{c}</div>
        )
      })}
    </>
  )
}