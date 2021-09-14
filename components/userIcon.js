/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { css } from '@emotion/core'
import NoImage from './noImage'

const iconURL = process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL + '/user/'

export default function UserIcon({ id, name }) {
  const [url ,setURL] = useState('')
  const [hasError, setHasError] = useState(false)

  function handleError() {
    setHasError(true)
  }

  useEffect(() => {
    setURL(iconURL + id + '.png')
  }, [id])

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
  borderRadius: '50%',
  overflow: 'hidden',
})

const imageStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})