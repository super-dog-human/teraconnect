/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function AlignContainer({ children, align }) {
  const bodyStyle = css({
    textAlign: align,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}