/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Vr({ height, color }) {
  const bodyStyle = css({
    width: '1px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  })

  const borderStyle = css({
    height,
    borderLeft: `1px solid ${color}`,
  })

  return (
    <div css={bodyStyle}>
      <div css={borderStyle} />
    </div>
  )
}