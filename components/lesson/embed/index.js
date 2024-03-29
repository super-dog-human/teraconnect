/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { css } from '@emotion/react'
import LessonPlayer from '../player/'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import usePlayer from '../../../libs/hooks/lesson/player/usePlayer'
import useSpeechPlayer from '../../../libs/hooks/lesson/player/useSpeechPlayer'
import useYoutubePlayer from '../../../libs/hooks/lesson/player/useYouTubePlayer'
import useViewCounter from '../../../libs/hooks/lesson/player/useViewCounter'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import { useDialogContext } from '../../../libs/contexts/dialogContext'

export default function EmbedLesson({ id, viewKey  }) {
  const { showDialog } = useDialogContext()
  const [shouldRefleshPlayer, setShouldRefleshPlayer] = useState(false)
  const containerRef = useRef()
  const preCanPlayRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const shouldResumeRef = useRef(false)
  const { lesson, isLoading: isBodyLoading, durationSec, backgroundImageURL, avatars, drawings, embeddings, graphics, speeches, graphicURLs, speechURL, initializeLesson } = usePlayer({ id, viewKey, showDialog })
  const { isLoading: isSpeechLoading, isPlaying: isSpeechPlaying, playSpeech, stopSpeech, updateSpeeche, seekSpeech }
    = useSpeechPlayer({ url: speechURL, durationSec })
  const { isLoading: isYouTubeLoading, isPlaying: isYouTubePlaying, youTubeIDs, playYouTube, stopYouTube, updateYouTube, seekYoutube } = useYoutubePlayer({ durationSec, embeddings })
  const { isPlaying, isAvatarLoading, initializeElapsedTime, startPlaying, stopPlaying, handleSeekChange: handlePlayerSeekChange, ...playerProps }
    = useLessonPlayer({ durationSec, hasResize, avatar: lesson?.avatar, avatarLightColor: lesson?.avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, updateSpeeches: updateSpeeche, updateYouTube })
  const startViewing = useViewCounter({ lesson })

  const handlePlayButtonClick = useCallback(async () => {
    if (isPlaying) {
      stopSpeech()
      stopYouTube()

      stopPlaying()
    } else {
      startViewing()

      // 下記の二つはelapsedTimeをplayerとは別で管理しているので、先にこちらを実行する
      await playSpeech()
      playYouTube()

      startPlaying()
    }
  }, [isPlaying, startViewing, stopSpeech, stopYouTube, stopPlaying, startPlaying, playSpeech, playYouTube])

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
    setShouldRefleshPlayer(true)
  }, [id])

  useEffect(() => {
    if (!shouldRefleshPlayer) return
    setShouldRefleshPlayer(false)

    if (isPlaying) stopPlaying()
    initializeElapsedTime()
    initializeLesson()
  }, [shouldRefleshPlayer, isPlaying, stopPlaying, initializeElapsedTime, initializeLesson])

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
      <div css={bodyStyle} ref={containerRef}>
        <LessonPlayer isLoading={isAvatarLoading || isBodyLoading || isSpeechLoading || isYouTubeLoading} isPlaying={isPlaying} isShowFullController={true}
          durationSec={durationSec} backgroundImageURL={backgroundImageURL} hasAvatars={true} hasDrawings={true} hasEmbedding={true}
          onPlayButtonClick={handlePlayButtonClick} onSeekChange={handleSeekChange} onSeekUp={handleSeekUp} youTubeIDs={youTubeIDs} {...playerProps} />
      </div>
    </>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
})