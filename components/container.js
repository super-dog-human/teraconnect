/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Container({ children, width, height, minWidth, minHeight, maxWidth, maxHeight, display, invisible, position }) {
  const bodyStyle = css({
    display,
    visibility: invisible && 'hidden',
    position,
    width: width && `${width}px`,
    height: height && `${height}px`,
    minWidth: minWidth && `${minWidth}px`,
    minHeight: minHeight && `${minHeight}px`,
    maxWidth: maxWidth && `${maxWidth}px`,
    maxHeight: maxHeight && `${maxHeight}px`,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}