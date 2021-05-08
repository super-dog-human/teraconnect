/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function DrawingSortDownButton({ isSelected, disabled, onMouseDown }) {
  const bodyStyle = css({
    paddingLeft: '3px',
    '> img': {
      width: '8px',
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
    <button css={bodyStyle} disabled={disabled} onMouseDown={onMouseDown}>
      <img src="/img/icon/sort-down.svg" />
    </button>
  )
}