/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ImageUploadingIcon from './imageUploadingIcon'

export default function ImageUploadingButton({ onClick, disabled }) {
  return (
    <button css={bodyStyle} onClick={onClick} disabled={disabled}>
      <ImageUploadingIcon css={imageStyle} />
    </button>
  )
}

const bodyStyle = css({
  opacity: 0.7,
  [':hover']: {
    opacity: 1,
  },
  [':disabled']: {
    opacity: 0.3,
    cursor: 'default',
  },
})

const imageStyle = css({
  display: 'block',
})