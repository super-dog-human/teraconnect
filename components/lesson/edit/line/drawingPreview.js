import React, { useState } from 'react'
import Container from '../../../container'
import ContainerSpacer from '../../../containerSpacer'
import InputRange from '../../../form/inputRange'
import ColorFilter from '../../../colorFilter'
import DrawingPlayer from '../../../lesson/player/drawing'
import useDrawingPLayer from '../../../../libs/hooks/lesson/useDrawingPlayer'

export default function DrawingPreview({ drawings, drawing, sameTimeIndex }) {
  const [isHover, setIsHover] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { canvasRef, elapsedTime, seekDrawing } = useDrawingPLayer({
    isPlaying, setIsPlaying, drawings, drawing, sameTimeIndex, startElapsedTime: drawing.elapsedTime, endElapsedTime: drawing.elapsedTime + drawing.durationSec
  })

  function handleMouseOver() {
    setIsHover(true)
  }

  function handleMouseLeave() {
    setIsHover(false)
  }

  function handlePlayButtonClick() {
    setIsPlaying(p => !p)
  }

  function handleSeekChange(e) {
    seekDrawing(parseFloat(e.target.value))
  }

  function handleDragStart(e) {
    e.preventDefault() // 行ドラッグになってしまうのを防ぐ
    e.stopPropagation()
  }

  return (
    <ContainerSpacer left='20' top='20' bottom='20'>
      <Container width='302' height='170' position='relative'>
        <Container width='302' height='170' position='absolute'>
          <DrawingPlayer canvasRef={canvasRef} />
        </Container>
        <Container position='absolute'>
          <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            <div onClick={handlePlayButtonClick}>
              <Container width='302' height='140' />
            </div>
            <Container width='302' height='30' invisible={!isPlaying && !isHover}>
              <ContainerSpacer left='10' right='10'>
                <ColorFilter filter='drop-shadow(2px 2px 2px var(--dark-purple))'>
                  <InputRange key={elapsedTime} defaultValue={elapsedTime} min='0' max={parseFloat((drawing.durationSec).toFixed(2))} step='0.01'
                    onDragStart={handleDragStart} onInput={handleSeekChange} onChange={handleSeekChange} />
                </ColorFilter>
              </ContainerSpacer>
            </Container>
          </div>
        </Container>
      </Container>
    </ContainerSpacer>
  )
}