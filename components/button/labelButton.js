/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LabelButton({ children, size, backgroundColor='inherit', color='inherit', borderColor='inherit', onClick, disabled=false }) {
  const bodyStyle = css({
    width: '100%',
    height: '100%',
    fontSize: `${size}px`,
    borderColor,
    backgroundColor,
    color,
    ':hover': {
      filter: 'brightness(110%)',
    }
  })

  return (
    <button onClick={onClick} css={bodyStyle} disabled={disabled}>
      {children}
    </button>
  )
}