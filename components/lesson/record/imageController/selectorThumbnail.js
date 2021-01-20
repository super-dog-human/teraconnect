/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'

export default function SelectorThumbnail({ src, 'data-id': dataID, onClick, isSelected }) {
  const imageRef = useRef()

  const imageStyle = css({
    position: 'relative',
    display: 'block',
    marginTop: isSelected ? '-20px' : 'auto',
    cursor: 'pointer',
    maxWidth: '150px',
    maxHeight: '95px',
    height: 'auto',
    filter: isSelected ? 'drop-shadow(7px 10px 5px #ddd)' : 'brightness(0.9) grayscale(20%)',
  })

  return (
    <div css={bodyStyle} draggable="false">
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