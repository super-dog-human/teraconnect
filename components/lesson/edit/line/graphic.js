/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonEditKindIcon from './kindIcon'
import LessonEditActionLabel from './actionLabel'
import LessonEditGraphicThumbnail from '../graphicThumbnail'

export default function LessonEditLineGraphic({ graphic }) {
  return (
    <>
      <LessonEditKindIcon kind="graphic" status={graphic.action === 'show'} css={iconStyle}/>
      {graphic.action === 'show' && graphic.url && <LessonEditGraphicThumbnail url={graphic.url} css={imageStyle} />}
      {graphic.action === 'hide' && <LessonEditActionLabel kind="graphic" action={'hide'} />}
    </>
  )
}

const iconStyle = css({
  display: 'block',
  marginTop: '20px',
})

const imageStyle = css({
  marginTop: '20px',
  marginBottom: '20px',
})