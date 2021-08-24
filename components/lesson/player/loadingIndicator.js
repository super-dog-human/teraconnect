/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { default as OriginalIndicator } from '../../loadingIndicator'

export default function LoadingIndicator({ isLoading }) {
  const bodyStyle = css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  })

  return (
    <>
      {isLoading && <div css={bodyStyle} className='overay-ui-z'><OriginalIndicator size='25'/></div>}
    </>
  )
}