/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonDrawing(props) {

  const bodyStyle = css({
    display: 'block',
    opacity: props.isHide ? '0' : '1',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    width: '100%',
    height: '100%',
  })

  return (
    <canvas css={bodyStyle} className='drawing-z' onMouseDown={props.startDrawing}
      onMouseMove={props.inDrawing} onMouseUp={props.endDrawing} onMouseLeave={props.endDrawing} ref={props.drawingRef} />
  )
}