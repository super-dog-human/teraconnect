/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonPlayer() {
  return(
    <div css={bodyStyle}>
      <div css={playerStyle}>player</div>
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  width: '100%',
  height: 'auto',
  paddingTop: '56.25%',
})

const playerStyle = css({
  position: 'absolute',
  top: 0,
})