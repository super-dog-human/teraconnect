/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import Container from '../../../container'
import ContainerSpacer from '../../../containerSpacer'
import IconButton from '../../../button/iconButton'
import DrawingPlayer from '../../../lesson/player/drawing'

export default function DrawingPreview({ drawings, startElapsedTime }) {
  const [isPlaying, setIsPlaying] = useState(false)

  function handlePlayButtonClick() {
    setIsPlaying(p => !p)
  }

  const buttonStyle = css({
    opacity: isPlaying ? 0 : 1,
  })

  return (
    <ContainerSpacer left='20' top='20' bottom='20'>
      <div>
        <Container width='302' height='170' position='relative'>
          <Container width='302' height='170' position='absolute'>
            <div className='drawing-z'>
              <DrawingPlayer isPlaying={isPlaying} drawings={drawings} startElapsedTime={startElapsedTime} />
            </div>
          </Container>
          <Container position='absolute'>
            <div onClick={handlePlayButtonClick} css={buttonStyle} className='overay-ui-z'>
              <Container width='302' height='170'>
                <IconButton name='play-circle' borderColor='var(--soft-white)' padding='40' />
              </Container>
            </div>
          </Container>
        </Container>
      </div>
    </ContainerSpacer>
  )
}