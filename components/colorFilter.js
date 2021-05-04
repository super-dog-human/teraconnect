/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ColorFilter({ children, filter, hoverFilter, display }) {
  const bodyStyle = css({
    filter,
    ':hover': {
      filter: hoverFilter,
    },
    display,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}