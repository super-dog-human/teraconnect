/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'
import LoadingIndicator from '../../../components/loadingIndicator'
import { useImageViewerContext } from '../../../libs/contexts/imageViewerContext'

export default function LessonEditGraphicThumbnail({ url, className }) {
  const { setImage } = useImageViewerContext()
  const [loaded, setLoaded] = useState(false)

  function handleLoad() {
    setLoaded(true)
  }

  function handleClick(e) {
    const url = e.currentTarget.getAttribute('data-image-url')
    setImage({ url, widePer: 50 })
    e.stopPropagation()
  }

  const bodyStyle = css({
    position: 'relative',
    height: '100px',
  })

  const imageStyle = css({
    opacity: loaded ? 1 : 0,
    cursor: 'pointer',
    fontSize: 0,
  })

  const loadingStyle = css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '175px',
    height: '100px',
    filter: 'contrast(20%)',
  })

  return (
    <div css={bodyStyle} className={className}>
      {<Image src={url} width="175" height="100" objectFit="contain" css={imageStyle} data-image-url={url} onClick={handleClick} onLoad={handleLoad} />}
      {!loaded && <div css={loadingStyle}><LoadingIndicator size={50} /></div>}
    </div>
  )
}