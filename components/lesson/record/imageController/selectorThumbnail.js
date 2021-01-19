/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'

export default function SelectorThumbnail(props) {
  const [isSelected, setIsSelected] = useState(false)

  function handleClick(e) {
    setIsSelected(!isSelected)
    props.onClick(e)
  }

  const imageStyle = css({
    display: 'block',
    maxWidth: '150px',
    maxHeight: '95px',
    height: 'auto',
    cursor: 'pointer',
    border: isSelected ? '3px solid white' : 'none',
  })

  console.log('render thumb.')

  return (
    <img css={imageStyle} {...props} onClick={handleClick} />
  )
}