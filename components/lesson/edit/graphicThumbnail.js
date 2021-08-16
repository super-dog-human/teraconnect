/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import Image from 'next/image'
import Container from '../../container'
import LoadingIndicator from '../../loadingIndicator'
import AbsoluteContainer from '../../absoluteContainer'
import ColorFilter from '../../colorFilter'

const GraphicThumbnail = React.memo(function GraphicThumbnail({ url, isProcessing=false, isServerCaching=false }) {
  const [isLoaded, setIsLoaded] = useState(false)

  function handleLoad() {
    setIsLoaded(true)
  }

  return (
    <Container position='relative' width='175' height='100'>
      {url && isServerCaching &&
        <Image src={url} width="175" height="100" objectFit="contain" draggable={false} onLoad={handleLoad} alt='図表サムネイル' />
      }
      {url && !isServerCaching &&
        <img src={url} css={imageStyle} draggable={false} onLoad={handleLoad} alt='図表サムネイル' />
      }
      {(!isLoaded || isProcessing) &&
        <AbsoluteContainer top='0' left='0'>
          <ColorFilter filter='contrast(20%)'>
            <Container width='175' height='100'><LoadingIndicator size={50} /></Container>
          </ColorFilter>
        </AbsoluteContainer>
      }
    </Container>
  )
})

const imageStyle = css({
  width: '175px',
  height: '100px',
  objectFit: 'contain',
})

export default GraphicThumbnail