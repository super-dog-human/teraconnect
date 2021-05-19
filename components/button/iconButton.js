/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from '../loadingIndicator'

export default function IconButton({ name, backgroundColor, borderColor, hoverFilter, padding, disabled, isToggle, isProcessing, onClick }) {
  const bodyStyle = css({
    display: 'block',
    width: '100%',
    height: '100%',
    padding: padding ? `${padding}px` : '0px',
    fontSize: 0,
    borderColor: borderColor || 'inherit',
    backgroundColor: backgroundColor || 'inherit',
    filter: 'brightness(80%)',
    ':hover': {
      filter: hoverFilter || 'brightness(100%)',
    },
    ':disabled': {
      opacity: 0.3,
      cursor: 'default',
    },
  })

  return (
    <button onClick={onClick} disabled={disabled || isProcessing} css={bodyStyle}>
      {!isProcessing && <img src={`/img/icon/${name}.svg`} draggable={false} css={imageStyle} />}
      {isProcessing && <LoadingIndicator size='80' />}
    </button>
  )
}

const imageStyle = css({
  width: '100%',
  height: '100%',
})