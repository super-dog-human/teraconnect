/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import LessonEditGraphicThumbnail from '../graphicThumbnail'
import EditIcon from './editIcon'

export default function LessonLineGraphic({ graphic, lineIndex, kindIndex, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'graphic', lineIndex, kindIndex, graphic)
  }

  return (
    <>
      <LessonEditKindIcon kind="graphic" status={graphic.action === 'show'} css={iconStyle} />
      <div css={graphicContainerStyle}>
        {graphic.action === 'show' && <LessonEditGraphicThumbnail url={graphic.url} css={imageStyle} />}
        {graphic.action === 'hide' && <LessonEditActionLabel kind="graphic" action={'hide'} />}
      </div>
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} css={iconStyle}/>
    </>
  )
}

const iconStyle = css({
  display: 'block',
  marginTop: '20px',
})

const graphicContainerStyle = css({
  width: '100%',
})

const imageStyle = css({
  marginTop: '20px',
  marginBottom: '20px',
})