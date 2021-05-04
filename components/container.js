/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Container({ children, width, height, minWidth, minHeight, maxWidth, maxHeight, display, invisible, position }) {
  const bodyStyle = css({
    display,
    visibility: invisible ? 'hidden' : 'visible',
    position,
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
    minWidth: minWidth ? `${minWidth}px` : 'auto',
    minHeight: minHeight ? `${minHeight}px` : 'auto',
    maxWidth: maxWidth ? `${maxWidth}px` : 'none',
    maxHeight: maxHeight ? `${maxHeight}px` : 'none',
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}