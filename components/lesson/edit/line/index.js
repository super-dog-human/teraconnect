/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import LessonEditLineAvatar from './avatar'
import LessonEditLineDrawing from './drawing'
import LessonEditLineGraphic from './graphic'
import LessonEditLineMusic from './music'
import LessonEditLineSpeech from './speech'

export default function LessonEditLine({ index, kind, line }) {
  const [isEditButtonShow, setIsEditButtonShow] = useState(false)

  function handleMouseEnter() {
    setIsEditButtonShow(true)
  }

  function handleMouseLeave() {
    setIsEditButtonShow(false)
  }

  return(
    <div css={bodyStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {kind === 'avatar'  && <LessonEditLineAvatar avatar={line} index={index} isEditButtonShow={isEditButtonShow} />}
      {kind === 'drawing' && <LessonEditLineDrawing drawing={line} index={index} isEditButtonShow={isEditButtonShow} />}
      {kind === 'graphic' && <LessonEditLineGraphic graphic={line} index={index} isEditButtonShow={isEditButtonShow} />}
      {kind === 'music'   && <LessonEditLineMusic music={line} index={index} isEditButtonShow={isEditButtonShow} />}
      {kind === 'speech'  && <LessonEditLineSpeech speech={line} index={index} isEditButtonShow={isEditButtonShow} />}
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  width: '100%',
  minHeight: '55px',
})
