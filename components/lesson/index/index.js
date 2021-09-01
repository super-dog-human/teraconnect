/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect } from 'react'
import { css } from '@emotion/core'
import Header from '../../header'
import LessonPlayer from '../player/'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import usePlayer from '../../../libs/hooks/lesson/player/usePlayer'
import useSpeechPlayer from '../../../libs/hooks/lesson/player/useSpeechPlayer'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import { useDialogContext } from '../../../libs/contexts/dialogContext'

export default function Lesson({ lesson, errorStatus }) {
  const { showDialog } = useDialogContext()
  const containerRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const { isLoading: isBodyLoading, durationSec, backgroundImageURL, avatars, drawings, embeddings, graphics, speeches, graphicURLs, speechURL } = usePlayer({ lesson, errorStatus, showDialog })
  const { isPreparing, isPlaying: isSpeechPlaying, startPlaying: startSpeechPlaying, stopPlaying: stopSpeechPlaying, updateSpeeche, handleSeekChange: handleSpeechSeekChange }
    = useSpeechPlayer({ url: speechURL, durationSec })
  const { isPlaying, isPlayerHover, isAvatarLoading, startPlaying, stopPlaying, handleMouseOver, handleMouseLeave, handleSeekChange: handlePlayerSeekChange, ...playerProps }
    = useLessonPlayer({ durationSec, hasResize, avatar: lesson?.avatar, avatarLightColor: lesson?.avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, updateSpeeches: updateSpeeche })

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
        <div css={bodyStyle} ref={containerRef}>
          <LessonPlayer isLoading={isBodyLoading || isPreparing || isAvatarLoading} isPlaying={isPlaying} showFullController={true} title={lesson?.title}
            durationSec={durationSec} backgroundImageURL={backgroundImageURL} hasAvatars={true} hasDrawings={true}
            onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onPlayButtonClick={handlePlayButtonClick}
            controllerInvisible={!isPlayerHover} onSeekChange={handleSeekChange} {...playerProps} />
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
