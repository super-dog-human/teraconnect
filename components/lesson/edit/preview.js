/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import LessonPlayer from '../player/'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'
import useLessonPlayer from '../../../libs/hooks/lesson/useLessonPlayer'
import useSpeechesPlayer from '../../../libs/hooks/lesson/edit/useSpeechesPlayer'
import useMusicsPlayer from '../../../libs/hooks/lesson/edit/useMusicsPlayer'

export default function Preview({ lessonID }) {
  const [graphicURLs, setGraphicURLs] = useState({})
  const { durationSec, generalSetting, avatars, drawings, embeddings, graphics, graphicURLs: originalGraphicURLs, musics, musicURLs, speeches } = useLessonEditorContext()
  const { isLoading: isSpeechLoading, isPlaying: isSpeechPlaying, playSpeeches, stopSpeeches, updateSpeeches, seekSpeeches } = useSpeechesPlayer({ lessonID, durationSec, speeches })
  const { isLoading: isMusicLoading, isPlaying: isMusicPlaying, playMusics, stopMusics, updateMusics, seekMusics } = useMusicsPlayer({ durationSec, musics, musicURLs })
  const { startPlaying, stopPlaying, handleMouseOver, handleMouseLeave, handleSeekChange: handlePlayerSeekChange, isPlaying, isPlayerHover, ...playerProps } =
    useLessonPlayer({ durationSec, avatar: generalSetting.avatar, avatarLightColor: generalSetting.avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, updateSpeeches, updateMusics })

  function handlePlayButtonClick() {
    if (isPlaying) {
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
    handlePlayerSeekChange(e)
  }

  function handleSeekUp(e) {
    seekSpeeches(e)
    seekMusics(e)
    handlePlayerSeekChange(e)
  }

  useEffect(() => {
    setGraphicURLs(Object.keys(originalGraphicURLs)
      .reduce((newObj, key) => ({ ...newObj, [key]: originalGraphicURLs[key].url }), {}))
  }, [originalGraphicURLs])

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
      <LessonPlayer isLoading={isSpeechLoading || isMusicLoading} isPlaying={isPlaying} showFullController={true}
        durationSec={durationSec} backgroundImageURL={generalSetting.backgroundImageURL} hasAvatars={true} hasDrawings={true}
        onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onPlayButtonClick={handlePlayButtonClick}
        controllerInvisible={!isPlayerHover} onSeekChange={handleSeekChange} onSeekUp={handleSeekUp} {...playerProps} />
    </div>
  )
}

const bodyStyle = css({
  width: '450px',
  height: '253px',
})