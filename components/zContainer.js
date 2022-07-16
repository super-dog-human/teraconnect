/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function ZContainer({ zIndex, position, children }) {
  const bodyStyle = css({
    width: '100%',
    height: '100%',
    zIndex,
    position,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}