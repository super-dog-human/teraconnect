/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function PlainText({ children, size, color, lineHeight, letterSpacing, fontFamily }) {
  const bodyStyle = css({
    color,
    lineHeight: lineHeight ? `${lineHeight}px` : null,
    letterSpacing: letterSpacing ? `${letterSpacing}px` : null,
    fontSize: size ? `${size}px` : null,
    fontFamily,
    marginRight: letterSpacing ? `-${letterSpacing}px` : null,
  })

  return (
    <span css={bodyStyle}>{children}</span>
  )
}