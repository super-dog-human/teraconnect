/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function SelectorThumbnail({ src, 'data-index': dataIndex, onClick, isSelected }) {

  const imageStyle = css({
    display: 'block',
    maxWidth: '150px',
    maxHeight: '95px',
    height: 'auto',
    cursor: 'pointer',
    border: isSelected ? '3px solid white' : 'none',
  })

  return (
    <img css={imageStyle} src={src} data-index={dataIndex} onClick={onClick} />
  )
}