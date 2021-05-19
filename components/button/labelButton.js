/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LabelButton({ children, fontSize, backgroundColor, color, borderColor, hoverBackgroundColor, hoverColor, onClick, disabled }) {
  const bodyStyle = css({
    width: '100%',
    height: '100%',
    padding: 0,
    borderColor,
    backgroundColor,
  })

  const labelStyle = css({
    padding: '6px 12px',
    fontSize: fontSize && `${fontSize}px`,
    color,
    filter: 'brightness(80%)',
    ':hover': {
      backgroundColor: hoverBackgroundColor,
      color: hoverColor,
      filter: 'brightness(100%)',
    },
    ':disabled': {
      filter: 'contrast(30%) brightness(160%)',
    },
  })

  return (
    <button onClick={onClick} css={bodyStyle} disabled={disabled}>
      <div css={labelStyle}>
        {children}
      </div>
    </button>
  )
}