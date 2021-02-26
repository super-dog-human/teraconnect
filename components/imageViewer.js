/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'
import LoadingIndicator from './loadingIndicator'
import { useImageViewerContext } from '../libs/contexts/imageViewerContext'

export default function ImageViwer() {
  const [isShow, setIsShow] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { image } = useImageViewerContext()

  useEffect(() => {
    if (Object.keys(image).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [image])

  function handleLoad(e) {
    console.log('loaded..', e.target.complete)
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
  })

  const imageContainerStyle = css({
    width: '60%',
    height: '60%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    //    marginTop: '77px',
    //    width: `${image.widePer || 100}%`,
    //    height: 'auto',
    //    opacity: loaded ? 1 : 0,
    //    backgroundColor: 'blue',
    fontSize: 0,
  })

  const imageStyle = css({
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  })

  const loadingStyle = css({
    position: 'fixed',
    width: '175px',
    height: '100px',
    //    marginTop: '77px',
    //    filter: 'contrast(20%)',
  })

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