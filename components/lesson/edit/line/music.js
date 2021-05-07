import React from 'react'
import KindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineMusic({ music, index, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'music', index, music)
  }

  return (
    <>
      <KindIcon kind="music" status={music.action === 'start'} />
      <LessonEditActionLabel kind="music" action={music.action} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}