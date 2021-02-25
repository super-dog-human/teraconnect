/** @jsxImportSource @emotion/react */
import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'

export default function LessonEditLineAvatar({ avatar }) {
  return (
    <>
      <LessonEditKindIcon kind="avatar" />
      <LessonEditActionLabel kind="avatar" />
    </>
  )
}