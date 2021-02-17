/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function uploadingIcon({ className }) {
  return (
    <img src="/img/icon/photo-upload.svg" css={bodyStyle} className={className} />
  )
}

const bodyStyle = css({
  width: '40px',
  height: 'auto',
})