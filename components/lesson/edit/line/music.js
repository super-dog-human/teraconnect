import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonEditLineMusic({ music, index, isEditButtonShow }) {
  function handleEditButtonClick(e) {
    console.log('editbutton clicked.')
    e.stopPropagation()
  }

  return (
    <>
      <LessonEditKindIcon kind="music" status={music.action === 'start'} />
      <LessonEditActionLabel kind="music" action={music.action} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}