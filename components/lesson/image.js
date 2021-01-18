/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonImage({ image }) {
  return (
    <div css={bodyStyle} className="image-z">
      {image && <img src={image.src} css={imageStyle} />}
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
  maxWidth: '90%',
  maxHeight: '90%',
  objectFit: 'contain',
})