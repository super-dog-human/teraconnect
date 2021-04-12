/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from '../loadingIndicator'

export default function IconButton({ name, backgroundColor='inherit', color='inherit', borderColor='inherit', padding='0', disabled=false, isProcessing=false, onClick }) {
  const bodyStyle = css({
    display: 'block',
    width: '100%',
    height: '100%',
    padding: `${padding}px`,
    fontSize: 0,
    borderColor,
    backgroundColor,
    color,
    ':hover': {
      filter: 'brightness(80%)',
    },
  })

  return (
    <button onClick={onClick} disabled={disabled || isProcessing} css={bodyStyle}>
      {!isProcessing && <img src={`/img/icon/${name}.svg`} draggable={false} css={imageStyle} />}
      {isProcessing && <LoadingIndicator size='80' />}
    </button>
  )
}

const imageStyle = css({
  width: '100%',
  height: '100%',
})