import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'

export default function LessonEditLineDrawing({ drawing }) {
  return (
    <>
      <LessonEditKindIcon kind="drawing" status={['draw', 'show'].includes(drawing.action)} />
      {drawing.action != 'draw' && <LessonEditActionLabel kind="drawing" action={drawing.action} status={['draw', 'show'].includes(drawing.action)} />}
    </>
  )
}