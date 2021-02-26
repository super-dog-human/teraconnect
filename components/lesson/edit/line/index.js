import React from 'react'
import LessonEditLineAvatar from './avatar'
import LessonEditLineDrawing from './drawing'
import LessonEditLineGraphic from './graphic'
import LessonEditLineMusic from './music'
import LessonEditLineSpeech from './speech'

export default function LessonEditLine({ kind, line }) {
  return(
    <>
      {kind === 'avatar'  && <LessonEditLineAvatar avatar={line} />}
      {kind === 'drawing' && <LessonEditLineDrawing drawing={line} />}
      {kind === 'graphic' && <LessonEditLineGraphic graphic={line} />}
      {kind === 'music'   && <LessonEditLineMusic music={line} />}
      {kind === 'speech'  && <LessonEditLineSpeech speech={line} />}
    </>
  )
}