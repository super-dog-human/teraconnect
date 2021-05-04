/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'
import LoadingIndicator from '../../loadingIndicator'
import AbsoluteContainer from '../../absoluteContainer'
import Container from '../../container'
import ColorFilter from '../../colorFilter'
import { useImageViewerContext } from '../../../libs/contexts/imageViewerContext'

export default function GraphicThumbnail({ url }) {
  const { setImage } = useImageViewerContext()
  const [isLoaded, setIsLoaded] = useState(false)

  function handleLoad() {
    setIsLoaded(true)
  }

  function handleClick(e) {
    const url = e.currentTarget.dataset.imageUrl
    setImage({ url, widePer: 70 })
  }

  const imageStyle = css({
    opacity: isLoaded ? 1 : 0,
    fontSize: 0,
    cursor: 'pointer',
  })

  return (
    <div css={bodyStyle}>
      {url &&
        <Image src={url} width="175" height="100" objectFit="contain" draggable={false} css={imageStyle} data-image-url={url} onClick={handleClick} onLoad={handleLoad} />
      }
      {!isLoaded && <AbsoluteContainer top='0' left='0'>
        <ColorFilter filter='contrast(20%)'>
          <Container width='185' height='100'><LoadingIndicator size={50} /></Container>
        </ColorFilter>
      </AbsoluteContainer>
      }
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  width: '185px',
  height: '100px',
  textAlign: 'center',
})