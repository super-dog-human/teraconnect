/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Container from './container'

export default function AbsoluteContainer(props) {
  const { top, left, right, bottom, ...containerProps } = props
  const bodyStyle = css({
    position: 'absolute',
    top,
    left,
    right,
    bottom,
  })

  return (
    <div css={bodyStyle}><Container {...containerProps}/></div>
  )
}