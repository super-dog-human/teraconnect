/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import Container from '../../../container'
import ContainerSpacer from '../../../containerSpacer'
import DrawingPlayer from '../../../lesson/player/drawing'
import useDrawingPLayer from '../../../../libs/hooks/lesson/useDrawingPlayer'

export default function DrawingPreview({ drawings, drawing, sameTimeIndex }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const { canvasRef, elapsedTime } = useDrawingPLayer({
    isPlaying, setIsPlaying, drawings, drawing, sameTimeIndex, startElapsedTime: drawing.elapsedTime, endElapsedTime: drawing.elapsedTime + drawing.durationSec
  })

  function handlePlayButtonClick() {
    setIsPlaying(p => !p)
  }

  const buttonStyle = css({
    opacity: isPlaying ? 0 : 1,
  })

  useEffect(() => {
    console.log(elapsedTime)
  }, [elapsedTime])

  return (
    <ContainerSpacer left='20' top='20' bottom='20'>
      <div>
        <Container width='302' height='170' position='relative'>
          <Container width='302' height='170' position='absolute'>
            <div>
              <DrawingPlayer canvasRef={canvasRef} />
            </div>
          </Container>
          <Container position='absolute'>
            <div onClick={handlePlayButtonClick} css={buttonStyle}>
              <Container width='302' height='170'>
              </Container>
            </div>
          </Container>
        </Container>
      </div>
    </ContainerSpacer>
  )
}