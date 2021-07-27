/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function AbsoluteContainer(props) {
  const { top, left, right, bottom, children } = props
  const bodyStyle = css({
    position: 'absolute',
    top,
    left,
    right,
    bottom,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}