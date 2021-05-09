/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function PlainText({ children, size, color, fontFamily }) {
  const bodyStyle = css({
    color,
    fontSize: size ? `${size}px` : null,
    fontFamily,
  })

  return (
    <span css={bodyStyle}>{children}</span>
  )
}