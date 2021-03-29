/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function AlignContainer({ children, textAlign='start', verticalAlign='baseline' }) {
  const bodyStyle = css({
    textAlign,
    verticalAlign,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}