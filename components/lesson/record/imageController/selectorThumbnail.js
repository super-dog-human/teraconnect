/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from 'react'
import { css } from '@emotion/core'
import FillCircle from '../../../fillCircle'

export default function SelectorThumbnail({ src, 'data-id': dataID, onClick, isSelected }) {
  const [isPointed, setIsPointed] = useState(false)
  const imageRef = useRef()

  function handleMouseOver() {
    setIsPointed(true)
  }

  function handleMouseLeave() {
    setIsPointed(false)
  }

  function handleAnimationEnd() {
    if (!isPointed) return
    imageRef.current.click()
    setIsPointed(false)
  }

  function handleClick() {
    imageRef.current.click()
    setIsPointed(false)
  }

  const imageStyle = css({
    display: 'block',
    maxWidth: '150px',
    maxHeight: '95px',
    height: 'auto',
    animation: 'circle 2s',
    marginTop: isSelected ? '-20px' : 'auto',
    filter: isSelected ? 'drop-shadow(5px 10px 4px #ddd)' : 'brightness(0.9) grayscale(20%)',
  })

  return (
    <div css={bodyStyle} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      {isPointed && <FillCircle css={circleStyle} onAnimationEnd={handleAnimationEnd} sizePercent="20" />}
      <img css={imageStyle} src={src} data-id={dataID} ref={imageRef} onClick={onClick} />
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  cursor: 'pointer',
  width: '95px',
  height: '95px',
  maxWidth: '150px',
})

const circleStyle = css({
  position: 'absolute',
})