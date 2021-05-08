/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function DrawingConfigButton({ isSelected, disabled, onClick, children }) {
  const bodyStyle = css({
    '> img': {
      width: '18px',
      height: 'auto',
      verticalAlign: 'middle',
    },
    backgroundColor: isSelected ? 'var(--back-movie-black)' : 'inherit',
    ':hover': {
      backgroundColor: isSelected ? 'var(--back-movie-black)' : 'var(--text-gray)',
    },
    ':active': {
      backgroundColor: isSelected ? 'var(--back-movie-black)' : 'var(--text-gray)',
    },
    ':disabled': {
      opacity: '0.3',
      cursor: 'default',
      backgroundColor: 'var(--dark-gray)',
    },
  })

  return (
    <button css={bodyStyle} disabled={disabled} onClick={onClick}>{children}</button>
  )
}