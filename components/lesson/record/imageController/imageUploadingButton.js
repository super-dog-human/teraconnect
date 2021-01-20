/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ImageUploadingIcon from './imageUploadingIcon'

export default function ImageUploadingButton({ onClick }) {
  return (
    <button css={bodyStyle} onClick={onClick}>
      <ImageUploadingIcon />
    </button>
  )
}

const bodyStyle = css({
  [':hover']: {
    opacity: 0.6,
  },
})