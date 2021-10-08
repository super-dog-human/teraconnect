/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import NoImage from './noImage'

export default function FallbackImage({ url, name }) {
  const [hasError, setHasError] = useState(false)

  function handleError() {
    setHasError(true)
  }

  useEffect(() => {
    setHasError(false)
  }, [url])

  return (
    <div css={bodyStyle}>
      {!hasError && <img src={url} onError={handleError} alt={name} css={imageStyle} />}
      {hasError && <NoImage textSize='10' color='var(--soft-white)' backgroundColor='gray' />}
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
})

const imageStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})