import React, { useState } from 'react'
import Image from 'next/image'
import Container from '../../container'
import LoadingIndicator from '../../loadingIndicator'
import AbsoluteContainer from '../../absoluteContainer'
import ColorFilter from '../../colorFilter'
import { useImageViewerContext } from '../../../libs/contexts/imageViewerContext'

export default function GraphicThumbnail({ url, isProcessing }) {
  const { setImage } = useImageViewerContext()
  const [isLoaded, setIsLoaded] = useState(false)

  function handleLoad() {
    setIsLoaded(true)
  }

  function handleClick(e) {
    const url = e.currentTarget.dataset.imageUrl
    setImage({ url, widePer: 70 })
  }

  return (
    <Container position='relative' width='185' height='100'>
      {url &&
        <Image src={url} width="175" height="100" objectFit="contain" draggable={false} data-image-url={url} onClick={handleClick} onLoad={handleLoad} />
      }
      {(!isLoaded || isProcessing) &&
        <AbsoluteContainer top='0' left='0'>
          <ColorFilter filter='contrast(20%)'>
            <Container width='185' height='100'><LoadingIndicator size={50} /></Container>
          </ColorFilter>
        </AbsoluteContainer>
      }
    </Container>
  )
}