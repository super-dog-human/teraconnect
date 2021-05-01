/** @jsxImportSource @emotion/react */
import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineAvatar({ avatar, index, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'avatar', index, avatar)
  }

  return (
    <>
      <LessonEditKindIcon kind="avatar" />
      <LessonEditActionLabel kind="avatar" />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}