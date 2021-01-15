/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function DrawingConfigButton({ isSelected, className, disabled, onMouseDown, onClick, children }) {
  const bodyStyle = css({
    ['> img']: {
      width: '20px',
      height: 'auto',
      verticalAlign: 'middle',
    },
    backgroundColor: isSelected ? 'var(--back-movie-black)' : 'inherited',
    [':hover']: {
      backgroundColor: isSelected ? 'var(--back-movie-black)' : 'var(--text-gray)',
    },
    [':active']: {
      backgroundColor: isSelected ? 'var(--back-movie-black)' : 'var(--text-gray)',
    },
    [':disabled']: {
      opacity: '0.3',
      cursor: 'default',
      backgroundColor: 'var(--dark-gray)',
    },
  })

  return (
    <button css={bodyStyle} className={className} disabled={disabled} onMouseDown={onMouseDown} onClick={onClick}>{children}</button>
  )
}