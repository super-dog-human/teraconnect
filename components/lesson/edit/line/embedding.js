import React from 'react'
import KindIcon from './kindIcon'
import ActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineEmbedding({ embedding, index, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'embedding', index, embedding)
  }

  return (
    <>
      <KindIcon kind="embedding" />
      <ActionLabel kind="embedding" action={embedding.action} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}