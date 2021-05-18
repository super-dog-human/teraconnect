import React from 'react'
import Container from '../../../container'
import ContainerSpacer from '../../../containerSpacer'
import InputRange from '../../../form/inputRange'
import ColorFilter from '../../../colorFilter'
import PlainText from '../../../plainText'
import Drawing from '../../drawing'
import useDrawingPreview from '../../../../libs/hooks/lesson/edit/useDrawingPreview'

export default function DrawingPreview({ drawings, drawing, sameTimeIndex }) {
  const { drawingRef, handleMouseOver, handleMouseLeave, handlePlayButtonClick, isPlayerHover, playerElapsedTime, handleDragStart, handleSeekChange }
    = useDrawingPreview({ startElapsedTime: drawing.elapsedTime, drawings, drawing, sameTimeIndex })

  return (
    <ContainerSpacer left='20' top='20' bottom='20'>
      <Container width='302' height='170' position='relative'>
        <Container width='302' height='170' position='absolute'>
          <Drawing drawingRef={drawingRef} backgroundColor='lightgray' />
        </Container>
        <Container width='302' height='170' position='absolute'>
          <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            <div onClick={handlePlayButtonClick}>
              <Container width='302' height='140' />
            </div>
            <Container width='302' height='30' invisible={!isPlayerHover}>
              <ContainerSpacer left='15' right='15'>
                <ColorFilter filter='drop-shadow(2px 2px 2px var(--dark-purple))'>
                  <InputRange key={playerElapsedTime} defaultValue={playerElapsedTime} min='0' max={parseFloat((drawing.durationSec).toFixed(2))} step='0.01'
                    onDragStart={handleDragStart} onInput={handleSeekChange} onChange={handleSeekChange} />
                </ColorFilter>
              </ContainerSpacer>
            </Container>
          </div>
        </Container>
      </Container>
      {drawing.units && drawing.units.some(d => d.action === 'draw' && d.durationSec === 0) &&
        <PlainText size='13' color='gray'>収録停止中に描かれた線は、アニメーションなしで表示されます。</PlainText>
      }
    </ContainerSpacer>
  )
}