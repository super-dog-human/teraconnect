/** @jsxImportSource @emotion/react */
import React, { useRef, useState } from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from '../../../loadingIndicator'

export default function SelectorThumbnail({ image, onClick, onRemoveClick, isSelected, isFinishing }) {
  const imageRef = useRef()
  const [isHover, setIsHover] = useState(false)

  function handleMouseEnter() {
    setIsHover(true)
  }

  function hanldeMouseLeave( ){
    setIsHover(false)
  }

  function handleMouseClick(e) {
    if (isFinishing) return
    onClick(e)
  }

  const imageStyle = css({
    display: 'block',
    marginTop: isSelected ? '-20px' : 'auto',
    cursor: isFinishing ? 'default' : 'pointer',
    maxWidth: '150px',
    maxHeight: '95px',
    height: 'auto',
    filter: isSelected ? 'drop-shadow(7px 10px 5px #ddd)' : 'brightness(0.9) grayscale(20%)',
    opacity: isFinishing ? 0.3 : 1,
  })

  const removeButtonStyle = css({
    position: 'absolute',
    top: 0,
    right: 10,
    width: '10px',
    height: '30px',
    display: isHover && !isFinishing ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    border: 'none',
    opacity: '0.5',
    [':hover']: {
      opacity: '1',
    },
  })

  return (
    <div css={bodyStyle} onMouseEnter={handleMouseEnter} onMouseLeave={hanldeMouseLeave} draggable="false">
      <img css={imageStyle} src={image.thumbnail} data-id={image.id} ref={imageRef} onClick={handleMouseClick} draggable="true" />
      <button css={removeButtonStyle} data-id={image.id} onClick={onRemoveClick}>
        <img src="/img/icon/close.svg" css={closeIconStyle} draggable="false" />
      </button>
      {image.isUploading && <div css={indicatorStyle}><LoadingIndicator size={50} /></div>}
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  maxWidth: '150px',
  marginLeft: '10px',
  marginRight: '10px',
})

const indicatorStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 'auto',
  width: '100%',
  height: '100%',
})

const closeIconStyle = css({
  display: 'block',
  width: '10px',
  height: '10px',
  filter: 'drop-shadow(2px 2px 5px #000)',
})