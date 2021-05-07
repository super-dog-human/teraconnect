/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Hr({ color }) {
  const bodyStyle = css({
    height: '1px',
    border: 'none',
    margin: 0,
    backgroundColor: color,
  })

  return (
    <hr css={bodyStyle} />
  )
}