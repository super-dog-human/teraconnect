/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function PlainText({ children, size, color, lineHeight, fontWeight, letterSpacing, fontFamily, whiteSpace, textShadow, userSelect }) {
  const bodyStyle = css({
    color,
    lineHeight: lineHeight && `${lineHeight}px`,
    letterSpacing: letterSpacing && `${letterSpacing}px`,
    marginRight: letterSpacing && `-${letterSpacing}px`,
    fontSize: size && `${size}px`,
    fontWeight,
    fontFamily,
    whiteSpace,
    textShadow,
    userSelect,
  })

  return (
    <span css={bodyStyle}>{children}</span>
  )
}