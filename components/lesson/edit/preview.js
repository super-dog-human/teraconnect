/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useScreenClass } from 'react-grid-system'
import LessonPlayer from '../player'

export default function LessonEditPreview() {
  const screenClass = useScreenClass()

  const bodyStyle = css({
    maxWidth: ['xs', 'sm'].includes(screenClass) ? '100%' : '450px',
  })

  return (
    <div css={bodyStyle}>
      <LessonPlayer />
    </div>
  )
}
