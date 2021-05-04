/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function FullscreenContainer({ children, position, display='block', isShow=true, zKind, onClick }) {
  const bodyStyle = css({
    position,
    display: isShow ? display : 'none',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
  })

  return (
    <div css={bodyStyle} className={`${zKind}-z`} onClick={onClick}>{children}</div>
  )
}