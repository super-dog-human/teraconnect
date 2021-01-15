/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function DrawingConfigButton({ isSelected, className, onClick, children }) {
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
  })

  return (
    <button css={bodyStyle} className={className} onClick={onClick}>{children}</button>
  )
}