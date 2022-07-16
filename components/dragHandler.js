/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function DragHandler({ children }) {
  return (
    <div css={bodyStyle} className="drag-handle">{children}</div>
  )
}

const bodyStyle = css({
  cursor: 'move',
})