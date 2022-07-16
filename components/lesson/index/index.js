/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useCallback, useEffect } from 'react'
import Head from 'next/head'
import { css } from '@emotion/react'
import LessonPlayer from '../player/'
import Description from './description'
import Navigator from './navigator'
import Heading from './heading'
import Transcription from './transcription'
import Graphics from './graphics'
import Embeddings from './embeddings'
import ReferenceBooks from './referenceBooks'
import Author from './author'
import ImageViwer from '../../imageViewer'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import usePlayer from '../../../libs/hooks/lesson/player/usePlayer'
import useSpeechPlayer from '../../../libs/hooks/lesson/player/useSpeechPlayer'
import useYoutubePlayer from '../../../libs/hooks/lesson/player/useYouTubePlayer'
import useViewCounter from '../../../libs/hooks/lesson/player/useViewCounter'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import useMobileDetector from '../../../libs/hooks/useMobileDetector'
import { useDialogContext } from '../../../libs/contexts/dialogContext'
import { ImageViewerProvider } from '../../../libs/contexts/imageViewerContext'

export default function Lesson({ id, viewKey }) {
  const { showDialog } = useDialogContext()
  const [shouldRefleshPlayer, setShouldRefleshPlayer] = useState(false)
  const containerRef = useRef()
  const preCanPlayRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const isMobile = useMobileDetector()
  const shouldResumeRef = useRef(false)
  const { lesson, isLoading: isBodyLoading, durationSec, backgroundImageURL, avatars, drawings, embeddings, graphics, speeches, graphicURLs, speechURL, initializeLesson } = usePlayer({ id, viewKey, showDialog })
  const { isLoading: isSpeechLoading, isPlaying: isSpeechPlaying, playSpeech, stopSpeech, updateSpeeche, seekSpeech } = useSpeechPlayer({ url: speechURL, durationSec })
  const { isLoading: isYouTubeLoading, isPlaying: isYouTubePlaying, youTubeIDs, playYouTube, stopYouTube, updateYouTube, seekYoutube } = useYoutubePlayer({ durationSec, embeddings })
  const { isPlaying, isAvatarLoading, initializeElapsedTime, startPlaying, stopPlaying, handleSeekChange: handlePlayerSeekChange, ...playerProps }
    = useLessonPlayer({ durationSec, hasResize, avatar: lesson?.avatar, avatarLightColor: lesson?.avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, updateSpeeches: updateSpeeche, updateYouTube })
  const startViewing = useViewCounter({ lesson })

  const handlePlayButtonClick = useCallback(async () => {
    if (isPlaying) {
      stopPlaying()

      stopSpeech()
      stopYouTube()
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

  const handleSeekUp = useCallback(e => {
    seekSpeech(e)
    seekYoutube(e, true)
    handlePlayerSeekChange(e)
  }, [seekSpeech, seekYoutube, handlePlayerSeekChange])

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
      <Head>
        {!!lesson && `<title>${lesson.author.name} の ${lesson.title} - TERACONNECT</title>`}
        <meta name="twitter:card" content="player" />
        <meta name="twitter:site" content="TERACONNECT" />
        <meta name="twitter:title" content="あなたの光が、誰かを照らす - TERACONNECT" />
        <meta name="twitter:player" content={`${process.env.NEXT_PUBLIC_TERACONNECT_FRONT_URL}/lessons/embed/${id}?view_key=${viewKey}`} />
        <meta name="twitter:url" content={`${process.env.NEXT_PUBLIC_TERACONNECT_FRONT_URL}/lessons/${id}`} />
        <meta name="twitter:player:width" content="640" />
        <meta name="twitter:player:height" content="360" />
        <meta name="og:image" content={`${process.env.NEXT_PUBLIC_TERACONNECT_FRONT_URL}/img/logo_square.png`} />
      </Head>
      <ImageViewerProvider>
        <div css={bodyStyle} ref={containerRef}>
          <LessonPlayer isLoading={isAvatarLoading || isBodyLoading || isSpeechLoading || isYouTubeLoading} isPlaying={isPlaying} isShowFullController={true}
            durationSec={durationSec} backgroundImageURL={backgroundImageURL} hasAvatars={true} hasDrawings={true} hasEmbedding={true}
            onPlayButtonClick={handlePlayButtonClick} onSeekChange={handleSeekChange} onSeekUp={handleSeekUp} youTubeIDs={youTubeIDs} {...playerProps} />
          <div css={selectableStyle}>
            <Description lesson={lesson} />
            <Navigator isMobile={isMobile} lesson={lesson} />
            <Heading isMobile={isMobile} name='講義全文'>
              <Transcription speeches={speeches} />
            </Heading>
            {graphics.length > 0 && <Heading isMobile={isMobile} name='スライド'>
              <Graphics isMobile={isMobile} graphics={graphics} graphicURLs={graphicURLs} />
            </Heading>}
            {embeddings.length > 0 && <Heading isMobile={isMobile} name='動画'>
              <Embeddings isMobile={isMobile} embeddings={embeddings} />
            </Heading>}
            {!!lesson?.references && <Heading isMobile={isMobile} name='参考図書'>
              <ReferenceBooks isMobile={isMobile} references={lesson?.references} />
            </Heading>}
            <Heading isMobile={isMobile} name='作者'>
              <Author author={lesson?.author} />
            </Heading>
          </div>
        </div>
        <ImageViwer />
      </ImageViewerProvider>
    </>
  )
}

const bodyStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
  height: '100%',
  userSelect: 'none',
})

const selectableStyle = css({
  userSelect: 'text',
})