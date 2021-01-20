/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from 'react'
import { css } from '@emotion/core'
import FillCircle from '../../../fillCircle'

export default function SelectorThumbnail({ src, 'data-id': dataID, onClick, isSelected }) {
  const [isPointed, setIsPointed] = useState(false)
  const imageRef = useRef()

  function handleMouseEnter() {
    setIsPointed(true)
  }

  function handleMouseLeave() {
    setIsPointed(false)
  }

  function handleMouseDown() {
    setIsPointed(false)
  }

  function handleAnimationEnd() {
    if (!isPointed) return
    imageRef.current.click()
    setIsPointed(false)
  }

  const circleStyle = css({
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    filter: 'drop-shadow(2px 2px 8px #555)',
  })

  const imageStyle = css({
    position: 'relative',
    display: 'block',
    marginTop: isSelected ? '-20px' : 'auto',
    cursor: 'pointer',
    maxWidth: '150px',
    maxHeight: '95px',
    height: 'auto',
    animation: 'circle 2s',
    filter: isSelected ? 'drop-shadow(7px 10px 5px #ddd)' : 'brightness(0.9) grayscale(20%)',
  })

  return (
    <div css={bodyStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown} draggable="false">
      {isPointed && <FillCircle css={circleStyle} onAnimationEnd={handleAnimationEnd} sizePercent="20" className="indicator-z" draggable="false" />}
      <img css={imageStyle} src={src} data-id={dataID} ref={imageRef} onClick={onClick} draggable="true" />
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  cursor: 'pointer',
  maxWidth: '150px',
  paddingLeft: '10px',
  paddingRight: '10px',
})