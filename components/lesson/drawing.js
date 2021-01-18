/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonDrawing({ isHide, startDrawing, inDrawing, endDrawing, drawingRef }) {

  const bodyStyle = css({
    display: 'block',
    opacity: isHide ? '0' : '1',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    width: '100%',
    height: '100%',
  })

  return (
    <canvas css={bodyStyle} className='drawing-z' onMouseDown={startDrawing}
      onMouseMove={inDrawing} onMouseUp={endDrawing} onMouseLeave={endDrawing} ref={drawingRef} />
  )
}