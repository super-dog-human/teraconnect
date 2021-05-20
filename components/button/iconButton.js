/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from '../loadingIndicator'

export default function IconButton({ name, backgroundColor, hoverBackgroundColor, toggledBackgroundColor, borderColor, padding, disabled, isToggle, isProcessing, onClick, onMouseDown }) {
  const buttonDisable = disabled || isProcessing
  const bodyStyle = css({
    display: 'block',
    width: '100%',
    height: '100%',
    padding: padding ? `${padding}px` : '0px',
    fontSize: 0,
    borderColor: borderColor,
    backgroundColor: isToggle ? toggledBackgroundColor : backgroundColor,
    opacity: isToggle ? 1 : 0.7,
    ':hover': {
      backgroundColor: !buttonDisable && (isToggle && toggledBackgroundColor) || !buttonDisable && hoverBackgroundColor,
      opacity: !buttonDisable && 1,
    },
    ':active': {
      backgroundColor: isToggle && toggledBackgroundColor,
    },
    ':disabled': {
      cursor: 'default',
    },
  })

  const imageStyle = css({
    width: '100%',
    height: '100%',
    opacity: buttonDisable ? 0.3 : 1,
  })

  return (
    <button onClick={onClick} onMouseDown={onMouseDown} disabled={buttonDisable} css={bodyStyle}>
      {!isProcessing && <img src={`/img/icon/${name}.svg`} draggable={false} css={imageStyle} />}
      {isProcessing && <LoadingIndicator size='80' />}
    </button>
  )
}