/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import UploadingIcon from './uploadingIcon'

export default function uploadingButton({ onClick, disabled, isTouchDevice }) {
  const bodyStyle = css({
    opacity: isTouchDevice ? 1 : 0.7,
    ':hover': {
      opacity: 1,
    },
    ':disabled': {
      opacity: 0.3,
      cursor: 'default',
    },
  })

  return (
    <button css={bodyStyle} onClick={onClick} disabled={disabled}>
      <UploadingIcon />
    </button>
  )
}