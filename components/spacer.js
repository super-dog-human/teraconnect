/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Spacer({ width=1, height=1 }) {
  const bodyStyle = css({
    width: `${width}px`,
    height: `${height}px`,
  })

  return (
    <div css={bodyStyle} />
  )
}