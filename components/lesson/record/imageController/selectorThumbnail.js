/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from '../../../loadingIndicator'

export default function SelectorThumbnail({ image, onClick, isSelected }) {
  const imageRef = useRef()

  const imageStyle = css({
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
      <img css={imageStyle} src={image.thumbnail} data-id={image.id} ref={imageRef} onClick={onClick} draggable="true" />
      {image.isUploading && <div css={indicatorStyle}><LoadingIndicator size={50} /></div>}
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  maxWidth: '150px',
  paddingLeft: '10px',
  paddingRight: '10px',
})

const indicatorStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 'auto',
  width: '100%',
  height: '100%',
})