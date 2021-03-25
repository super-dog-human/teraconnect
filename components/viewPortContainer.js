/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ViewPortContainer({ position='static', children, top=0, right=0, bottom=0, left=0, width, height, zKind }) {
  const bodyStyle = css({
    position,
    width: `${width}vw`,
    height: `${height}vh`,
    top,
    right,
    bottom,
    left,
  })

  return (
    <div css={bodyStyle} className={`${zKind}-z`}>{children}</div>
  )
}