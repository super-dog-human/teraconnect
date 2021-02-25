import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'

export default function LessonEditLineMusic({ music }) {
  return (
    <>
      <LessonEditKindIcon kind="music" status={music.action === 'start'} />
      <LessonEditActionLabel kind="music" action={music.action} />
    </>
  )
}