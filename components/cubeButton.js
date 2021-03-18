/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function CubeButton({ className, icon, onClick }) {
  return (
    <button className={className} onClick={onClick} css={iconStyle}>
      <img src={`/img/icon/${icon}.svg`} onClick={onClick} draggable={false} />
    </button>
  )
}

const iconStyle = css({
  fontSize: 0,
})