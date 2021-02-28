/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonPlayer() {
  return(
    <div css={bodyStyle}>
      <div css={playerStyle}></div>
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  width: '100%',
  height: 'auto',
  paddingTop: '56.25%',
  backgroundColor: 'var(--back-movie-black)',
})

const playerStyle = css({
  position: 'absolute',
  top: 0,
})