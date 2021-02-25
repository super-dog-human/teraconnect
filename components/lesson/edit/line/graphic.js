import React from 'react'
import Image from 'next/image'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'

export default function LessonEditLineGraphic({ graphic }) {
  return (
    <>
      <LessonEditKindIcon kind="graphic" />
      {graphic.action === 'show' && <Image width={176} height={100} src={graphic.url}/>}
      {graphic.action === 'hide' && <LessonEditActionLabel kind="graphic" action={'hide'} />}
    </>
  )
}