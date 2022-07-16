/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/react'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import LessonPlayer from '../player/'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import useSpeechesPlayer from '../../../libs/hooks/lesson/edit/useSpeechesPlayer'
import useMusicsPlayer from '../../../libs/hooks/lesson/edit/useMusicsPlayer'
import useYoutubePlayer from '../../../libs/hooks/lesson/player/useYouTubePlayer'

export default function Preview({ lessonID }) {
  const shouldResumeRef = useRef(false)
  const preCanPlayRef = useRef()
  const containerRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const [graphicURLs, setGraphicURLs] = useState({})
  const { durationSec, generalSetting, avatars, drawings, embeddings, graphics, graphicURLs: originalGraphicURLs, musics, musicURLs, speeches } = useLessonEditorContext()
  const { isLoading: isSpeechLoading, isPlaying: isSpeechPlaying, playSpeeches, stopSpeeches, updateSpeeches, seekSpeeches } = useSpeechesPlayer({ lessonID, durationSec, speeches })
  const { isLoading: isMusicLoading, isPlaying: isMusicPlaying, playMusics, stopMusics, updateMusics, seekMusics } = useMusicsPlayer({ durationSec, musics, musicURLs })
  const { isLoading: isYouTubeLoading, isPlaying: isYouTubePlaying, youTubeIDs, playYouTube, stopYouTube, updateYouTube, seekYoutube } = useYoutubePlayer({ durationSec, embeddings })
  const { isAvatarLoading, startPlaying, stopPlaying, handleSeekChange: handlePlayerSeekChange, isPlaying, ...playerProps } =
    useLessonPlayer({ durationSec, hasResize, avatar: generalSetting.avatar, avatarLightColor: generalSetting.avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, updateSpeeches, updateMusics, updateYouTube })

  function handlePlayButtonClick() {
    if (isPlaying) {
      stopSpeeches()
      stopMusics()
      stopYouTube()

      stopPlaying()
    } else {
      playSpeeches()
      playMusics()
      playYouTube()

      startPlaying()
    }
  }

  function handleSeekChange(e) {
    handlePlayerSeekChange(e)
    seekYoutube(e, false)
  }

  function handleSeekUp(e) {
    seekSpeeches(e)
    seekMusics(e)
    seekYoutube(e, true)
    handlePlayerSeekChange(e)
  }

  useEffect(() => {
    setGraphicURLs(Object.keys(originalGraphicURLs).reduce((newObj, key) => ({ ...newObj, [key]: originalGraphicURLs[key].url }), {}))
  }, [originalGraphicURLs])

  useEffect(() => {
    const canPlay = [isAvatarLoading, isSpeechLoading, isMusicLoading, isYouTubeLoading].every(l => !l)
    if (preCanPlayRef.current === canPlay) return
    preCanPlayRef.current = canPlay

    if (canPlay && shouldResumeRef.current) {
      shouldResumeRef.current = false
      if (!isSpeechPlaying) playSpeeches()
      if (!isMusicPlaying) playMusics()
      if (!isYouTubePlaying) playYouTube()
      if (!isPlaying) startPlaying()
    } else if (!canPlay) {
      if (isPlaying) shouldResumeRef.current = true
      if (isSpeechPlaying && !isSpeechLoading) stopSpeeches()
      if (isMusicPlaying && !isMusicLoading) stopMusics()
      if (isYouTubePlaying && !isYouTubeLoading) stopYouTube()
      if (isPlaying) stopPlaying()
    }
  }, [isAvatarLoading, isSpeechLoading, isMusicLoading, isYouTubeLoading, isPlaying, isMusicPlaying, isSpeechPlaying, isYouTubePlaying, playSpeeches, playMusics, playYouTube, startPlaying, stopSpeeches, stopMusics, stopYouTube, stopPlaying])

  return (
    <div css={bodyStyle} ref={containerRef}>
      <LessonPlayer isLoading={isAvatarLoading || isSpeechLoading || isMusicLoading || isYouTubeLoading} isPlaying={isPlaying} isShowFullController={true}
        durationSec={durationSec} backgroundImageURL={generalSetting.backgroundImageURL} hasAvatars={true} hasDrawings={true} hasEmbedding={true}
        onPlayButtonClick={handlePlayButtonClick} onSeekChange={handleSeekChange} onSeekUp={handleSeekUp} youTubeIDs={youTubeIDs} {...playerProps} />
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
})