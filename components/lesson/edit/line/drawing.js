/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import KindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineDrawing({ drawing, index, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'drawing', index, drawing)
  }

  return (
    <>
      <KindIcon kind="drawing" status={['draw', 'show'].includes(drawing.action)} />
      <div css={drwaingContainerStyle}>
        {drawing.action != 'draw' && <LessonEditActionLabel kind="drawing" action={drawing.action} />}
      </div>
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}

const drwaingContainerStyle = css({
  width: '100%',
})