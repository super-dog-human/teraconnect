/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Icon({ name, disabled }) {
  const bodyStyle = css({
    width: '100%',
    height: '100%',
    opacity: disabled ? 0.3 : 1,
  })

  return (
    <img src={`/img/icon/${name}.svg`} draggable={false} css={bodyStyle} alt={`${name}アイコン`} />
  )
}