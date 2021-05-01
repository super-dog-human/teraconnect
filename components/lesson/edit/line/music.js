import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineMusic({ music, index, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'music', index, music)
  }

  return (
    <>
      <LessonEditKindIcon kind="music" status={music.action === 'start'} />
      <LessonEditActionLabel kind="music" action={music.action} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}