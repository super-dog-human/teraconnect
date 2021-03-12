/** @jsxImportSource @emotion/react */
import React from 'react'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonEditLineAvatar({ avatar, lineIndex, kindIndex, isEditButtonShow }) {
  function handleEditButtonClick(e) {
    console.log('editbutton clicked.')
    e.stopPropagation()
  }

  return (
    <>
      <LessonEditKindIcon kind="avatar" />
      <LessonEditActionLabel kind="avatar" />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}