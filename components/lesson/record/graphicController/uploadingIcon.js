/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function UploadingIcon() {
  return (
    <img src="/img/icon/photo-upload.svg" css={bodyStyle} alt='アップロードアイコン' />
  )
}

const bodyStyle = css({
  width: '40px',
  height: 'auto',
})