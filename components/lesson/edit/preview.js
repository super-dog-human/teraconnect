/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useScreenClass } from 'react-grid-system'
import LessonPlayer from '../player'

export default function LessonEditPreview(props) {
  const screenClass = useScreenClass()

  const bodyStyle = css({
    //    maxWidth: ['xs', 'sm'].includes(screenClass) ? '100%' : '450px',
    width: '450px',
    height: '253px',
  })

  return (
    <div css={bodyStyle}>
      <LessonPlayer {...props} />
    </div>
  )
}
