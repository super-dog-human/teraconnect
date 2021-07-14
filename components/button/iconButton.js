/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Icon from '../icon'
import LoadingIndicator from '../loadingIndicator'

export default function IconButton(props) {
  const { name, backgroundColor, hoverBackgroundColor, toggledBackgroundColor, borderColor, padding, disabled, isToggle, isProcessing, ...buttonProps } = props
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

  return (
    <button {...buttonProps} disabled={buttonDisable} css={bodyStyle}>
      {!isProcessing && <Icon name={name} disabled={buttonDisable} />}
      {isProcessing && <LoadingIndicator size='80' />}
    </button>
  )
}