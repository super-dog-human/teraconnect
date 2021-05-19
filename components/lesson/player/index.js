import React from 'react'
import Aspect16To9Container from '../../aspect16To9Container'
import AbsoluteContainer from '../../absoluteContainer'
import BackgroundImage from '../backgroundImage'
import Drawing from '../drawing'
import SeekBar from './seekBar'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'

export default function LessonPlayer({ durationSec, bgImageURL, avatars, graphics, drawings, speeches }) {
  const { drawingRef, handleMouseOver, handleMouseLeave, handlePlayButtonClick, isPlayerHover, playerElapsedTime, handleDragStart, handleSeekChange } = useLessonPlayer({ durationSec, avatars, graphics, drawings, speeches })


  return (
    <Aspect16To9Container>
      <AbsoluteContainer top='0'>
        <BackgroundImage src={bgImageURL} />
        <Drawing drawingRef={drawingRef} zKind='drawing' />
      </AbsoluteContainer>
      <AbsoluteContainer top='0'>
        <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
          <div onClick={handlePlayButtonClick}>
          </div>
        </div>
        <SeekBar invisible={!isPlayerHover} playerElapsedTime={playerElapsedTime} maxTime={parseFloat(durationSec.toFixed(2))} handleDragStart={handleDragStart} handleSeekChange={handleSeekChange} />
      </AbsoluteContainer>
    </Aspect16To9Container>
  )
}