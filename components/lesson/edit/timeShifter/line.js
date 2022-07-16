/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function TimeShifterLine() {
  const bodyStyle = css({
    height: '1px',
    border: 'none',
    margin: '0 auto',
    backgroundColor: '#dedede',
  })

  return (
    <hr css={bodyStyle} />
  )
}