/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ColorFilter({ children, filter, display }) {
  const bodyStyle = css({
    filter,
    display,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}