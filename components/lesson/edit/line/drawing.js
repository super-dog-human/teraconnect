/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import LessonEditKindIcon from './kindIcon'

export default function LessonEditLineDrawing({ drawing }) {
  useEffect(() => {
    console.log(drawing)
  }, [])

  return (
    <>
      <LessonEditKindIcon kind="drawing" status={'on'} />
    </>
  )
}