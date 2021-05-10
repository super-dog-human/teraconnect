import React from 'react'
import KindIcon from './kindIcon'
import ActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineAvatar({ avatar, index, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'avatar', index, avatar)
  }

  return (
    <>
      <KindIcon kind="avatar" />
      <ActionLabel kind="avatar" />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}