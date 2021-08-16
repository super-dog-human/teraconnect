/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonGraphic({ graphic }) {
  return (
    <div css={bodyStyle} className="image-z">
      {graphic && <img src={graphic.src} css={imageStyle} alt='図表' />}
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const imageStyle = css({
  margin: 'auto',
  minWidth: '20%',
  minHeight: '20%',
  maxWidth: '90%',
  maxHeight: '90%',
  objectFit: 'contain',
})