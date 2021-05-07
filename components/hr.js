/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Hr({ width, color }) {
  const bodyStyle = css({
    width,
    height: '1px',
    border: 'none',
    margin: '0 auto',
    backgroundColor: color,
  })

  return (
    <hr css={bodyStyle} />
  )
}