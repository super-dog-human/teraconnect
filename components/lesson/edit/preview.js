/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'
import LessonPlayer from '../player/'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import useSpeechesPlayer from '../../../libs/hooks/lesson/edit/useSpeechesPlayer'

export default function Preview({ lessonID }) {
  const { durationSec, generalSetting, avatars, drawings, graphics, musics, speeches } = useLessonEditorContext()
  const { isLoading: isSpeechLoading, isPlaying: isSpeechPlaying, playSpeeches, stopSpeeches, updateSpeeches, seekSpeeches } = useSpeechesPlayer({ lessonID, durationSec, speeches })
  const { startPlaying, stopPlaying, handleMouseOver, handleMouseLeave, handleDragStart, handleSeekChange: handlePlayerSeekChange, isPlaying, isPlayerHover, ...playerProps } =
    useLessonPlayer({ startElapsedTime: 0, durationSec, avatars, drawings, graphics, musics, updateSpeeches })

  function handlePlayButtonClick() {
    if (isSpeechPlaying) {
      stopSpeeches()
      stopPlaying()
    } else {
      playSpeeches()
      startPlaying()
    }
  }

  function handleSeekChange(e) {
    if (e.type !== 'change') return
    seekSpeeches(e)
    handlePlayerSeekChange(e)
  }

  useEffect(() => {
    if (isPlaying && !isSpeechPlaying) {
      stopPlaying()
    } else if (!isPlaying && isSpeechPlaying) {
      startPlaying()
    }
  }, [isPlaying, isSpeechPlaying, startPlaying, stopPlaying])

  return (
    <div css={bodyStyle}>
      <LessonPlayer isLoading={isSpeechLoading} isPlaying={isPlaying} durationSec={durationSec} backgroundImageURL={generalSetting.backgroundImageURL} graphics={graphics} drawings={drawings}
        onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onPlayButtonClick={handlePlayButtonClick}
        controllerInvisible={!isPlayerHover} maxTime={parseFloat(durationSec.toFixed(2))} onDragStart={handleDragStart} onSeekChange={handleSeekChange}
        {...playerProps} />
    </div>
  )
}

const bodyStyle = css({
  width: '450px',
  height: '253px',
})