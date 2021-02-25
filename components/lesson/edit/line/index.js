/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonEditLineSpeech from './speech'
import LessonEditLineGraphic from './graphic'
import LessonEditLineDrawing from './drawing'
import LessonEditLineAvatar from './avatar'
import LessonEditLineMusic from './music'

export default function LessonEditLine({ kind, lines }) {
  return(
    <>
      {kind === 'avatar'  && lines.map((l, i) => <div css={lineBodyStyle} key={i}><LessonEditLineAvatar avatar={l} /></div>)}
      {kind === 'drawing' && lines.map((l, i) => <div css={lineBodyStyle} key={i}><LessonEditLineDrawing drawing={l} /></div>)}
      {kind === 'graphic' && lines.map((l, i) => <div css={lineBodyStyle} key={i}><LessonEditLineGraphic graphic={l} /></div>)}
      {kind === 'music'   && lines.map((l, i) => <div css={lineBodyStyle} key={i}><LessonEditLineMusic music={l} /></div>)}
      {kind === 'speech'  && lines.map((l, i) => <div css={lineBodyStyle} key={i}><LessonEditLineSpeech speech={l} /></div>)}
    </>
  )
}

const lineBodyStyle = css({
  display: 'flex',
  width: '100%',
  minHeight: '55px',
})