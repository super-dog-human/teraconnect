/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ImageUploadingIcon() {
  return (
    <img src="/img/icon/photo-upload.svg" css={bodyStyle} />
  )
}

const bodyStyle = css({
  width: '40px',
  height: 'auto',
})