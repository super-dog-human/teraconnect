/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LoadingIndicator({ size }) {
  const imageStyle = css({
    width: `${size}%`,
    height: `${size}%`,
    animation: '2s linear infinite rotation',
  })

  return (
    <div css={bodyStyle} className='indicator-z'>
      <img src="/img/icon/loading.svg" css={imageStyle} draggable="false" />
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})