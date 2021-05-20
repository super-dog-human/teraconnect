/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function SVGButton({ children, backgroundColor, color, borderColor, padding, disabled, onClick }) {
  const bodyStyle = css({
    display: 'block',
    width: '100%',
    height: '100%',
    padding: padding && `${padding}px`,
    borderColor,
    backgroundColor,
    color,
    opacity: 0.7,
    ':hover': {
      opacity: 1,
    },
    ':disabled': {
      opacity: 0.3,
      cursor: 'default',
    },
  })

  return (
    <button onClick={onClick} css={bodyStyle} disabled={disabled}>
      {children}
    </button>
  )
}