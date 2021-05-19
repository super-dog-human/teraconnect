/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function PlainText({ children, size, color, lineHeight, letterSpacing, fontFamily }) {
  const bodyStyle = css({
    color,
    lineHeight: lineHeight && `${lineHeight}px`,
    letterSpacing: letterSpacing && `${letterSpacing}px`,
    fontSize: size && `${size}px`,
    fontFamily,
    marginRight: letterSpacing && `-${letterSpacing}px`,
  })

  return (
    <span css={bodyStyle}>{children}</span>
  )
}