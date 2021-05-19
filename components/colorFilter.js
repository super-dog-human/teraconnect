/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ColorFilter({ children, filter, hoverFilter, opacity, hoverOpacity }) {
  const bodyStyle = css({
    filter,
    opacity,
    transform: 'translateZ(0)', // safariの描画ゴミ抑止のためGPUを使用する
    ':hover': {
      filter: hoverFilter,
      opacity: hoverOpacity,
    },
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}