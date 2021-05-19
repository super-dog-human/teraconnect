/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonDrawing({ drawingRef, isHide, startDrawing, inDrawing, endDrawing, backgroundColor, zKind }) {
  const backgroundStyle = css({
    backgroundColor: backgroundColor,
    position: 'absolute',
    top: 0,
  })

  const bodyStyle = css({
    opacity: isHide ? '0' : '1', // 非表示時も透明でアバターのドラッグイベントを取得する
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  })

  return (
    <div css={backgroundStyle} className={zKind && `${zKind}-z`}>
      <canvas width='1280' height='720' css={bodyStyle} ref={drawingRef}
        onMouseDown={startDrawing} onMouseMove={inDrawing} onMouseUp={endDrawing} onMouseLeave={endDrawing}
        onTouchStart={startDrawing} onTouchMove={inDrawing} onTouchEnd={endDrawing} onTouchCancel={endDrawing} />
    </div>
  )
}