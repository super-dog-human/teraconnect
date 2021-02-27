import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonEditLineDrawing({ drawing, index, isEditButtonShow }) {
  function handleEditButtonClick(e) {
    console.log('editbutton clicked.')
    e.stopPropagation()
  }

  return (
    <>
      <LessonEditKindIcon kind="drawing" status={['draw', 'show'].includes(drawing.action)} />
      {drawing.action != 'draw' && <LessonEditActionLabel kind="drawing" action={drawing.action} status={['draw', 'show'].includes(drawing.action)} />}
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}