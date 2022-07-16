/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function Spacer({ width=1, height=1 }) {
  const bodyStyle = css({
    width: `${width}px`,
    height: `${height}px`,
  })

  return (
    <div css={bodyStyle} />
  )
}