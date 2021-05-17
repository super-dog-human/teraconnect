/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonDrawing({ drawingRef, isHide, startDrawing, inDrawing, endDrawing, backgroundColor, zKind }) {
  const bodyStyle = css({
    visibility: isHide ? 'hidden' : 'visible',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: backgroundColor,
  })

  return (
    <canvas width='1280' height='720' css={bodyStyle} ref={drawingRef}
      onMouseDown={startDrawing} onMouseMove={inDrawing} onMouseUp={endDrawing} onMouseLeave={endDrawing}
      onTouchStart={startDrawing} onTouchMove={inDrawing} onTouchEnd={endDrawing} onTouchCancel={endDrawing} className={zKind && `${zKind}-z`} />
  )
}