/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Aspect16To9Container from '../../aspect16To9Container'
import BackgroundImage from '../backgroundImage'
import Avatar from '../avatar'
import Drawing from '../drawing'
import Graphic from '../graphic'
import GeoGebra from './geoGebra'
import YouTube from './youTube'
import Subtitle from './subtitle'
import Caption from './caption'
import Controller from './controller'
import LoadingIndicator from './loadingIndicator'

const isShowSubtitleInPlayer = 'isShowSubtitleInPlayer'

export default function LessonPlayer(props) {
  const { isLoading, isPlaying, isShowFullController, durationSec, backgroundImageURL, avatarRef, geoGebra, youTubeIDs, graphic, subtitle, hasAvatars, hasDrawings, hasEmbedding, drawingRef, startDrawing, inDrawing, endDrawing, disabledControl, ...controllerProps } = props
  const [isShowSubtitle, setIsShowSubtitle] = useState(false)

  function handleSubtitleButtonClick() {
    setIsShowSubtitle(state => {
      if (!state) {
        localStorage.setItem(isShowSubtitleInPlayer, 'true')
      } else {
        localStorage.removeItem(isShowSubtitleInPlayer)
      }
      return !state
    })
  }

  useEffect(() => {
    const showSubtitleConfig = localStorage.getItem(isShowSubtitleInPlayer) === 'true'
    setIsShowSubtitle(showSubtitleConfig)
  }, [])

  return (
    <Aspect16To9Container>
      {backgroundImageURL && <BackgroundImage url={backgroundImageURL} />}
      {hasAvatars && <Avatar ref={avatarRef} />}
      {hasDrawings && <Drawing drawingRef={drawingRef} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} zKind='drawing' />}
      {hasEmbedding && <GeoGebra isPlaying={isPlaying} geoGebra={geoGebra} />}
      {hasEmbedding && <YouTube isPlaying={isPlaying} youTubeIDs={youTubeIDs}/>}
      {graphic && <Graphic graphic={graphic}/>}
      {subtitle && <Caption caption={subtitle.caption} />}
      {isShowSubtitle && subtitle && <Subtitle subtitle={subtitle.body} />}
      {!disabledControl && <Controller isLoading={isLoading} isPlaying={isPlaying} isShowSubtitle={isShowSubtitle} isShowFullController={isShowFullController}
        maxTime={parseFloat(durationSec.toFixed(2))} onSubtitleButtonClick={handleSubtitleButtonClick} {...controllerProps} />}
      {<LoadingIndicator size='100' isLoading={isLoading}/>}
    </Aspect16To9Container>
  )
}