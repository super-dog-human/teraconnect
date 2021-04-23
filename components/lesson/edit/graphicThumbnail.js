/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'
import LoadingIndicator from '../../../components/loadingIndicator'
import { useImageViewerContext } from '../../../libs/contexts/imageViewerContext'

export default function LessonEditGraphicThumbnail({ url }) {
  const { setImage } = useImageViewerContext()
  const [isLoaded, setIsLoaded] = useState(false)

  function handleLoad() {
    setIsLoaded(true)
  }

  function handleClick(e) {
    const url = e.currentTarget.dataset['imageUrl']
    setImage({ url, widePer: 70 })
    e.stopPropagation()
  }

  const imageStyle = css({
    opacity: isLoaded ? 1 : 0,
    fontSize: 0,
  })

  return (
    <div css={bodyStyle}>
      {url && <Image src={url} width="175" height="100" objectFit="contain" css={imageStyle} data-image-url={url} onClick={handleClick} onLoad={handleLoad} />}
      {!isLoaded && <div css={loadingStyle}><LoadingIndicator size={50} /></div>}
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  width: '175px',
  height: '100px',
})


const loadingStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '175px',
  height: '100px',
  filter: 'contrast(20%)',
  cursor: 'auto',
})