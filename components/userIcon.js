/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import FallbackImage from './fallbackImage'

const iconURL = process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL + '/user/'

export default function UserIcon({ id, name }) {
  const [url ,setURL] = useState('')

  useEffect(() => {
    setURL(iconURL + id + '.png')
  }, [id])

  return (
    <div css={bodyStyle}>
      <FallbackImage url={url} name={name} />
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  overflow: 'hidden',
})