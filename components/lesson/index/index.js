/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'
import Header from '../../header'
import LessonPlayer from '../player/'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import usePlayer from '../../../libs/hooks/lesson/player/usePlayer'
import useSpeechPlayer from '../../../libs/hooks/lesson/player/useSpeechPlayer'
import { useDialogContext } from '../../../libs/contexts/dialogContext'

export default function Lesson({ lesson, errorStatus }) {
  const { showDialog } = useDialogContext()
  const { isLoading: isBodyLoading, durationSec, backgroundImageURL, avatars, graphics, drawings, graphicURLs, speechURL } = usePlayer({ lesson, errorStatus, showDialog })
  const { isPreparing, isPlaying: isSpeechPlaying, startPlaying: startSpeechPlaying, stopPlaying: stopSpeechPlaying, updateSpeeche, handleSeekChange: handleSpeechSeekChange }
    = useSpeechPlayer({ url: speechURL, durationSec })
  const { isPlaying, isPlayerHover, isAvatarLoading, startPlaying, stopPlaying, handleMouseOver, handleMouseLeave, handleSeekChange: handlePlayerSeekChange, ...playerProps }
    = useLessonPlayer({ durationSec, avatars, drawings, graphics, graphicURLs, updateSpeeches: updateSpeeche })

  function handlePlayButtonClick() {
    if (isPlaying) {
      stopSpeechPlaying()
      stopPlaying()
    } else {
      startSpeechPlaying()
      startPlaying()
    }
  }

  function handleSeekChange(e) {
    handleSpeechSeekChange(e)
    handlePlayerSeekChange(e)
  }

  useEffect(() => {
    // 音声を主としてそれ以外の再生を追従させる
    if (isPlaying && !isSpeechPlaying) {
      stopPlaying()
    }
    if (!isPlaying && isSpeechPlaying) {
      startPlaying()
    }
  }, [isPlaying, isSpeechPlaying, startPlaying, stopPlaying])

  return (
    <>
      <Header />
      <main css={mainStyle}>
        <div css={bodyStyle}>
          <LessonPlayer isLoading={isBodyLoading || isPreparing} isPlaying={isPlaying} durationSec={durationSec}
            backgroundImageURL={backgroundImageURL} hasGraphics={true} hasDrawings={true}
            onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onPlayButtonClick={handlePlayButtonClick}
            controllerInvisible={!isPlayerHover} maxTime={parseFloat(durationSec.toFixed(2))} onSeekChange={handleSeekChange} {...playerProps} />
        </div>
      </main>
    </>
  )
}

const mainStyle = css({
  backgroundColor: 'var(--bg-light-gray)',
  userSelect: 'none',
})

const bodyStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
  height: '100%',
})
