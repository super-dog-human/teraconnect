/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ScrollArrow({ className, direction }) {
  function handleMouseOver() {
    console.log('scroll, ', direction)
  }

  const iconStyle = css({
    display: 'block',
    width: '33px',
    height: 'auto',
    opacity: '0.5',
    cursor: 'pointer',
    margin: 'auto',
    transform: direction === 'left' ? 'rotate(180deg)' : 'none',
    [':hover']: {
      opacity: '1',
    },
  })

  return (
    <button className={className} onMouseOver={handleMouseOver}>
      <img src="/img/icon/double-arrows.svg" css={iconStyle} />
    </button>
  )
}