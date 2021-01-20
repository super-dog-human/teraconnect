/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function SelectorThumbnail({ src, 'data-id': dataID, onClick, isSelected }) {
  const imageStyle = css({
    display: 'block',
    marginLeft: '10px',
    marginRight: '10px',
    marginTop: isSelected ? '-20px' : 'auto',
    cursor: 'pointer',
    maxWidth: '150px',
    maxHeight: '95px',
    height: 'auto',
    animation: 'circle 2s',
    filter: isSelected ? 'drop-shadow(7px 10px 4px #ddd)' : 'brightness(0.9) grayscale(20%)',
    [':hover']: {
      //      marginTop: '-20px',
      //      filter:  'drop-shadow(10px 10px 4px #ddd)'
    }
  })

  return (
    <img css={imageStyle} src={src} data-id={dataID} onClick={onClick} />
  )
}