/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function PlainText({ children, size, color }) {
  const bodyStyle = css({
    color,
    fontSize: `${size}px`
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}