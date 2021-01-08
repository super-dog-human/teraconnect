/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LoadingIndicator(props) {
  const bodyStyle = css({
    width: '100%',
    height: '100%',
    display: props.isLoading ? 'flex':  'none',
    backgroundColor: props.isLoading ? 'rgba(255, 255, 255, 0.7)' : '',
    justifyContent: 'center',
    alignItems: 'center',
  })

  const imageStyle = css({
    width: '15%',
    height: '15%',
    animation: '5s linear infinite rotation',
  })

  return (
    <div css={bodyStyle} className='indicator-z'>
      <img src="/img/icon/loading.svg" css={imageStyle} />
    </div>
  )
}
