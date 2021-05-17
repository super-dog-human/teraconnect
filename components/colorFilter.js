/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ColorFilter({ children, filter, hoverFilter }) {
  const bodyStyle = css({
    filter,
    ':hover': {
      filter: hoverFilter,
    },
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}