/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useTouchDeviceDetector from '../../libs/hooks/useTouchDeviceDetector'

export default function LabelButton(props) {
  const isTouchDevice = useTouchDeviceDetector()
  const { children, fontSize, backgroundColor, color, borderColor, hoverBackgroundColor, hoverColor, hoverBorderColor, disabled, ...buttonProps } = props

  const bodyStyle = css({
    width: '100%',
    height: '100%',
    padding: 0,
    borderColor,
    backgroundColor,
    cursor: disabled ? 'auto' : 'pointer',
    ':hover': {
      borderColor: !disabled && hoverBorderColor,
    },
  })

  const labelStyle = css({
    padding: '6px 12px',
    fontSize: fontSize && `${fontSize}px`,
    color,
    opacity: isTouchDevice ? 1 : 0.8,
    ':hover': {
      backgroundColor: !disabled && hoverBackgroundColor,
      color: !disabled && hoverColor,
      opacity: !disabled && 1,
    },
    ':disabled': {
      filter: 'contrast(30%) brightness(160%)',
    },
  })

  return (
    <button css={bodyStyle} disabled={disabled} {...buttonProps}>
      <div css={labelStyle}>
        {children}
      </div>
    </button>
  )
}