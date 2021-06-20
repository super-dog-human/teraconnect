/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from './loadingIndicator'
import { useImageViewerContext } from '../libs/contexts/imageViewerContext'

export default function ImageViwer() {
  const [isShow, setIsShow] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { image } = useImageViewerContext()

  function handleLoad() {
    setLoaded(true)
  }

  function handleBackClick() {
    setIsShow(false)
    setLoaded(false)
  }

  const bodyStyle = css({
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  })

  const imageContainerStyle = css({
    width: `${image.widePer}%`,
    height: `${image.widePer}%`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 0,
  })

  const imageStyle = css({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    opacity: loaded ? 1 : 0,
  })

  const loadingStyle = css({
    position: 'fixed',
    width: '175px',
    height: '100px',
  })

  useEffect(() => {
    if (Object.keys(image).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [image])

  return (
    <>
      {isShow && <div css={bodyStyle} className="overay-ui-z" onClick={handleBackClick}>
        <div css={imageContainerStyle}><img src={image.url} css={imageStyle} onLoad={handleLoad} /></div>
        {!loaded && <div css={loadingStyle}><LoadingIndicator size={100} /></div>}
      </div>
      }
    </>
  )
}