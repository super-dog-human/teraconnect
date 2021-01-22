/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

let isHover = false
let animationID

export default function ScrollArrow({ className, direction, targetRef }) {
  function handleMouseOver() {
    if (isHover) return

    isHover = true
    animate()
  }

  function handleMouseLeave() {
    cancelAnimationFrame(animationID)
    isHover = false
  }

  function animate() {
    let movePx = (direction === 'left') ? -20 : 20
    targetRef.current.scrollLeft += movePx

    animationID = requestAnimationFrame(animate)
  }

  const iconStyle = css({
    display: 'block',
    width: '33px',
    height: 'auto',
    cursor: 'pointer',
    margin: 'auto',
    transform: direction === 'left' ? 'rotate(180deg)' : 'none',
  })

  return (
    <button css={buttonStyle} className={className} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <img src="/img/icon/double-arrows.svg" css={iconStyle} />
    </button>
  )
}

const buttonStyle = css({
  opacity: '0.3',
  transition: 'opacity 0.5s',
  [':hover']: {
    opacity: '1',
  },
})