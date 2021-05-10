/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useDrawingPLayer from '../../../libs/hooks/lesson/useDrawingPlayer'

export default function DrawingPlayer(props) {
  const { canvasRef } = useDrawingPLayer(props)

  return (
    <div css={bodyStyle}>
      <canvas css={playerStyle} width='1280' height='720' ref={canvasRef} />
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  width: '100%',
  height: 'auto',
  paddingTop: '56.25%',
  backgroundColor: 'white',
})

const playerStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
})