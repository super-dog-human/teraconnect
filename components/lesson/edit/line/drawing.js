/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
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
      <div css={drwaingContainerStyle}>
        {drawing.action != 'draw' && <LessonEditActionLabel kind="drawing" action={drawing.action} status={['draw', 'show'].includes(drawing.action)} />}
      </div>
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}

const drwaingContainerStyle = css({
  width: '100%',
})