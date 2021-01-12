/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LoadingIndicator() {
  const bodyStyle = css({
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const imageStyle = css({
    width: '15%',
    height: '15%',
    animation: '5s linear infinite rotation',
  })

  return (
    <div css={bodyStyle}>
      <img src="/img/icon/loading.svg" css={imageStyle} />
    </div>
  )
}
