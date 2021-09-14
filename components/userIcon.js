/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import NoImage from './noImage'

const iconURL = process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL + '/user/'

export default function UserIcon({ id, name }) {
  const [hasError, setHasError] = useState(false)

  function handleError() {
    console.log('error...')
    setHasError(true)
  }

  return (
    <div css={bodyStyle}>
      {!hasError && <img src={iconURL + id + '.png'} onError={handleError} alt={name} css={imageStyle} />}
      {hasError && <NoImage textSize='10' color='var(--soft-white)' backgroundColor='gray' />}
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  overflow: 'hidden',
})

const imageStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})