/** @jsxImportSource @emotion/react */
import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineAvatar({ avatar, lineIndex, kindIndex, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'avatar', lineIndex, kindIndex, avatar)
  }

  return (
    <>
      <LessonEditKindIcon kind="avatar" />
      <LessonEditActionLabel kind="avatar" />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}