/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import AbsoluteContainer from '../../absoluteContainer'
import BackgroundImage from '../backgroundImage'
import Drawing from '../drawing'
import SeekBar from './seekBar'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'

export default function LessonPlayer({ durationSec, bgImageURL, avatars, graphics, drawings, speeches }) {
  const { drawingRef, handleMouseOver, handleMouseLeave, handlePlayButtonClick, isPlayerHover, playerElapsedTime, handleDragStart, handleSeekChange } = useLessonPlayer({ durationSec, avatars, graphics, drawings, speeches })


  return (
    <div css={bodyStyle}>
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
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  width: '100%',
  height: 'auto',
  paddingTop: '56.25%',
  backgroundColor: 'var(--back-movie-black)',
})