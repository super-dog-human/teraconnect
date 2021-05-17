/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ColorFilter({ children, filter, hoverFilter }) {
  const bodyStyle = css({
    filter,
    transform: 'translateZ(0)', // safariの描画ゴミ抑止のためGPUを使用する
    ':hover': {
      filter: hoverFilter,
    },
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}