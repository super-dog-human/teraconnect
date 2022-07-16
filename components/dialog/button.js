/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function Button({ children, onClick, disabled }) {
  return (
    <button css={buttonStyle} onClick={onClick} disabled={disabled}>{children}</button>
  )
}

const buttonStyle = css({
  width: '100px',
  fontSize: '15px',
})