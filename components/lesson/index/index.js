/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect } from 'react'
import { css } from '@emotion/core'
import Header from '../../header'
import LessonPlayer from '../player/'
import Description from './description'
import Transcription from './transcription'
import Graphics from './graphics'
import ReferenceBooks from './referenceBooks'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import usePlayer from '../../../libs/hooks/lesson/player/usePlayer'
import useSpeechPlayer from '../../../libs/hooks/lesson/player/useSpeechPlayer'
import useYoutubePlayer from '../../../libs/hooks/lesson/player/useYouTubePlayer'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import { useDialogContext } from '../../../libs/contexts/dialogContext'

export default function Lesson({ lesson, errorStatus }) {
  const { showDialog } = useDialogContext()
  const containerRef = useRef()
  const preCanPlayRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const shouldResumeRef = useRef(false)
  const { isLoading: isBodyLoading, durationSec, backgroundImageURL, avatars, drawings, embeddings, graphics, speeches, graphicURLs, speechURL } = usePlayer({ lesson, errorStatus, showDialog })
  const { isLoading: isSpeechLoading, isPlaying: isSpeechPlaying, playSpeech, stopSpeech, updateSpeeche, seekSpeech }
    = useSpeechPlayer({ url: speechURL, durationSec })
  const { isLoading: isYouTubeLoading, isPlaying: isYouTubePlaying, youTubeIDs, playYouTube, stopYouTube, updateYouTube, seekYoutube } = useYoutubePlayer({ durationSec, embeddings })
  const { isPlaying, isPlayerHover, isAvatarLoading, startPlaying, stopPlaying, handleMouseOver, handleMouseLeave, handleSeekChange: handlePlayerSeekChange, ...playerProps }
    = useLessonPlayer({ durationSec, hasResize, avatar: lesson?.avatar, avatarLightColor: lesson?.avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, updateSpeeches: updateSpeeche, updateYouTube })

  function handlePlayButtonClick() {
    if (isPlaying) {
      stopSpeech()
      stopYouTube()

      stopPlaying()
    } else {
      startPlaying()

      playSpeech()
      playYouTube()
    }
  }

  function handleSeekChange(e) {
    handlePlayerSeekChange(e)
    seekYoutube(e, false)
  }

  function handleSeekUp(e) {
    seekSpeech(e)
    seekYoutube(e, true)
    handlePlayerSeekChange(e)
  }

  useEffect(() => {
    const canPlay = [isAvatarLoading, isBodyLoading, isSpeechLoading, isYouTubeLoading].every(l => !l)
    if (preCanPlayRef.current === canPlay) return
    preCanPlayRef.current = canPlay

    if (canPlay && shouldResumeRef.current) {
      shouldResumeRef.current = false
      if (!isSpeechPlaying) playSpeech()
      if (!isYouTubePlaying) playYouTube()
      if (!isPlaying) startPlaying()
    } else if (!canPlay) {
      if (isPlaying) shouldResumeRef.current = true
      if (isSpeechPlaying && !isSpeechLoading) stopSpeech() // 音声読み込み中にstopSpeechするとノイズが走るので非ローディング状態でのみ実行
      if (isYouTubePlaying && !isYouTubeLoading) stopYouTube() // YouTube読み込み中にstopYouTubeすると読み込みが止まってしまうので非ローディング状態でのみ実行
      if (isPlaying) stopPlaying()
    }
  }, [isAvatarLoading, isBodyLoading, isSpeechLoading, isYouTubeLoading, isPlaying, isSpeechPlaying, isYouTubePlaying, playSpeech, playYouTube, startPlaying, stopSpeech, stopYouTube, stopPlaying])

  return (
    <>
      <Header />
      <main css={mainStyle}>
        <div css={bodyStyle} ref={containerRef}>
          <LessonPlayer isLoading={isAvatarLoading || isBodyLoading || isSpeechLoading || isYouTubeLoading} isPlaying={isPlaying} showFullController={true} title={lesson?.title}
            durationSec={durationSec} backgroundImageURL={backgroundImageURL} hasAvatars={true} hasDrawings={true} hasEmbedding={true}
            onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onPlayButtonClick={handlePlayButtonClick}
            controllerInvisible={!isPlayerHover} onSeekChange={handleSeekChange} onSeekUp={handleSeekUp} youTubeIDs={youTubeIDs} {...playerProps} />
          <div css={selectableStyle}>
            <Description description={lesson.description} />
            <Transcription speeches={speeches} />
            <Graphics graphics={graphics} graphicURLs={graphicURLs} />
            <ReferenceBooks references={lesson.references} />
          </div>
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

const selectableStyle = css({
  userSelect: 'text',
})