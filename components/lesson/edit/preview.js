/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonPlayer from '../player/'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'

export default function LessonEditPreview() {
  const { durationSec, bgImageURL, avatars, graphics, drawings, speeches } = useLessonEditorContext()
  const { handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart, handleSeekChange, isPlayerHover, ...playerProps } =
    useLessonPlayer({ startElapsedTime: 0, durationSec, avatars, graphics, drawings, speeches })

  return (
    <div css={bodyStyle}>
      <LessonPlayer durationSec={durationSec} bgImageURL={bgImageURL} graphics={graphics} drawings={drawings}
        onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onPlayButtonClick={handlePlayButtonClick}
        invisible={!isPlayerHover} maxTime={parseFloat(durationSec.toFixed(2))} onDragStart={handleDragStart} onSeekChange={handleSeekChange}
        {...playerProps} />
    </div>
  )
}

const bodyStyle = css({
  width: '450px',
  height: '253px',
})