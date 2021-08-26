/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { useUnmount } from 'react-use'
import { css } from '@emotion/core'
import LessonPlayer from '../player/'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import useSpeechesPlayer from '../../../libs/hooks/lesson/edit/useSpeechesPlayer'
import useMusicsPlayer from '../../../libs/hooks/lesson/edit/useMusicsPlayer'

export default function Preview({ lessonID }) {
  const { durationSec, generalSetting, avatars, drawings, graphics, musics, musicURLs, speeches } = useLessonEditorContext()
  const { isLoading: isSpeechLoading, isPlaying: isSpeechPlaying, playSpeeches, stopSpeeches, updateSpeeches, seekSpeeches } = useSpeechesPlayer({ lessonID, durationSec, speeches })
  const { isLoading: isMusicLoading, isPlaying: isMusicPlaying, playMusics, stopMusics, updateMusics, seekMusics } = useMusicsPlayer( { durationSec, musics, musicURLs })
  const { startPlaying, stopPlaying, handleMouseOver, handleMouseLeave, handleDragStart, handleSeekChange: handlePlayerSeekChange, isPlaying, isPlayerHover, ...playerProps } =
    useLessonPlayer({ startElapsedTime: 0, durationSec, avatars, drawings, graphics, musics, updateSpeeches, updateMusics })
  useUnmount(() => {
    if (isSpeechPlaying) stopSpeeches()
    if (isMusicPlaying )stopMusics()
    if (isPlaying) stopPlaying()
  })

  function handlePlayButtonClick() {
    if (isSpeechPlaying) {
      stopSpeeches()
      stopMusics()
      stopPlaying()
    } else {
      playSpeeches()
      playMusics()
      startPlaying()
    }
  }

  function handleSeekChange(e) {
    if (e.type !== 'change') return
    seekSpeeches(e)
    seekMusics(e)
    handlePlayerSeekChange(e)
  }

  useEffect(() => {
    if (isPlaying && (!isMusicPlaying || !isSpeechPlaying)) {
      if (isSpeechPlaying) stopSpeeches()
      if (isMusicPlaying) stopMusics()
      stopPlaying()
    } else if (!isPlaying && (isMusicPlaying || isSpeechPlaying)) {
      if (!isSpeechPlaying) playSpeeches()
      if (!isMusicPlaying) playMusics()
      startPlaying()
    }
  }, [isPlaying, isSpeechPlaying, isMusicPlaying, playSpeeches, stopSpeeches, playMusics, stopMusics, startPlaying, stopPlaying])

  return (
    <div css={bodyStyle}>
      <LessonPlayer isLoading={isSpeechLoading || isMusicLoading} isPlaying={isPlaying} durationSec={durationSec} backgroundImageURL={generalSetting.backgroundImageURL} graphics={graphics} drawings={drawings}
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