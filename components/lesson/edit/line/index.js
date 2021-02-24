/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonEditLineSpeech from './speech'
import LessonEditLineGraphic from './graphic'
import LessonEditLineDrawing from './drawing'
import LessonEditLineAvatar from './avatar'

export default function LessonEditLine({ kind, body }) {
  return(
    <div key={kind} css={lineBodyStyle}>
      {kind === 'speech'  && <LessonEditLineSpeech speech={body} />}
      {kind === 'graphic' && <LessonEditLineGraphic graphic={body} />}
      {kind === 'drawing' && <LessonEditLineDrawing drawing={body} />}
      {kind === 'avatar'  && <LessonEditLineAvatar avatar={body} />}
    </div>
  )
}

const lineBodyStyle = css({
  display: 'flex',
  width: '100%',
})