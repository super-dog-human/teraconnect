import React, { useState } from 'react'
import Image from 'next/image'
import Container from '../../container'
import LoadingIndicator from '../../loadingIndicator'
import AbsoluteContainer from '../../absoluteContainer'
import ColorFilter from '../../colorFilter'

const GraphicThumbnail = React.memo(function graphicThumbnail({ url, isProcessing=false }) {
  const [isLoaded, setIsLoaded] = useState(false)

  function handleLoad() {
    setIsLoaded(true)
  }

  return (
    <Container position='relative' width='175' height='100'>
      {url &&
        <Image src={url} width="175" height="100" objectFit="contain" draggable={false} onLoad={handleLoad} />
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

export default GraphicThumbnail