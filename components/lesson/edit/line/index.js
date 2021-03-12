/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import LessonEditLineAvatar from './avatar'
import LessonEditLineDrawing from './drawing'
import LessonEditLineGraphic from './graphic'
import LessonEditLineMusic from './music'
import LessonEditLineSpeech from './speech'

export default function LessonEditLine({ lineIndex, line, kindIndex, kind }) {
  const [isEditButtonShow, setIsEditButtonShow] = useState(false)

  function handleMouseEnter() {
    setIsEditButtonShow(true)
  }

  function handleMouseLeave() {
    setIsEditButtonShow(false)
  }

  return (
    <div css={bodyStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {kind === 'avatar'  && <LessonEditLineAvatar avatar={line} lineIndex={lineIndex} kindIndex={kindIndex} isEditButtonShow={isEditButtonShow} />}
      {kind === 'drawing' && <LessonEditLineDrawing drawing={line} lineIndex={lineIndex} kindIndex={kindIndex} isEditButtonShow={isEditButtonShow} />}
      {kind === 'graphic' && <LessonEditLineGraphic graphic={line} lineIndex={lineIndex} kindIndex={kindIndex} isEditButtonShow={isEditButtonShow} />}
      {kind === 'music'   && <LessonEditLineMusic music={line} lineIndex={lineIndex} kindIndex={kindIndex} isEditButtonShow={isEditButtonShow} />}
      {kind === 'speech'  && <LessonEditLineSpeech speech={line} lineIndex={lineIndex} kindIndex={kindIndex} isEditButtonShow={isEditButtonShow} />}
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  width: '100%',
  minHeight: '55px',
})
