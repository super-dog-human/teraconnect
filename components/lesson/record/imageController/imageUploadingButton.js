/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ImageUploadingIcon from './imageUploadingIcon'

export default function ImageUploadingButton({ onClick }) {
  return (
    <button css={bodyStyle} onClick={onClick}>
      <ImageUploadingIcon css={imageStyle} />
    </button>
  )
}

const bodyStyle = css({
  opacity: 0.7,
  [':hover']: {
    opacity: 1,
  },
})

const imageStyle = css({
  display: 'block',
})