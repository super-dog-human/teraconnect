/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/react'
import Container from '../../container'
import LoadingIndicator from '../../loadingIndicator'
import AbsoluteContainer from '../../absoluteContainer'
import ColorFilter from '../../colorFilter'

const MobileGraphicThumbnail = React.memo(function MobileGraphicThumbnail({ url }) {
  const [isLoaded, setIsLoaded] = useState(false)

  function handleLoad() {
    setIsLoaded(true)
  }

  return (
    <Container position='relative' maxWidth='170' maxHeigh='100' minWidth='150' minHeight='84'>
      <img src={url} css={imageStyle} draggable={false} onLoad={handleLoad} alt='図表サムネイル' />
      {!isLoaded &&
        <div css={loadingStyle}>
          <AbsoluteContainer top='0' left='0'>
            <ColorFilter filter='contrast(20%)'>
              <Container width='150' height='84'><LoadingIndicator size={50} /></Container>
            </ColorFilter>
          </AbsoluteContainer>
        </div>
      }
    </Container>
  )
})

const imageStyle = css({
  width: '100%',
  maxWidth: '170px',
  height: '100%',
  maxHeight: '100px',
  objectFit: 'contain',
})

const loadingStyle = css({
  width: '100%',
  height: '100%',
})

export default MobileGraphicThumbnail