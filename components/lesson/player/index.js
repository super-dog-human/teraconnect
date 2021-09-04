import React, { useEffect, useState } from 'react'
import Aspect16To9Container from '../../aspect16To9Container'
import Titlebar from './titleBar'
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
  const { isLoading, isPlaying, showFullController, title, durationSec, backgroundImageURL, avatarRef, geoGebra, youTubeIDs, graphic, subtitle, hasAvatars, hasDrawings, hasEmbedding, drawingRef, startDrawing, inDrawing, endDrawing, controllerInvisible, ...controllerProps } = props
  const [showSubtitle, setShowSubtitle] = useState(false)
  function handleSubtitleButtonClick() {
    setShowSubtitle(state => {
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
    setShowSubtitle(showSubtitleConfig)
  }, [])

  return (
    <Aspect16To9Container>
      {title && <Titlebar isPlaying={isPlaying} controllerInvisible={controllerInvisible} title={title} />}
      {backgroundImageURL && <BackgroundImage url={backgroundImageURL} />}
      {hasAvatars && <Avatar ref={avatarRef} />}
      {hasDrawings && <Drawing drawingRef={drawingRef} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} zKind='drawing' />}
      {hasEmbedding && <GeoGebra isPlaying={isPlaying} geoGebra={geoGebra} />}
      {hasEmbedding && <YouTube isPlaying={isPlaying} youTubeIDs={youTubeIDs}/>}
      {graphic && <Graphic graphic={graphic}/>}
      {subtitle && <Caption caption={subtitle.caption} />}
      {showSubtitle && subtitle && <Subtitle subtitle={subtitle.body} />}
      {!isLoading && <Controller isPlaying={isPlaying} showFullController={showFullController} controllerInvisible={controllerInvisible} maxTime={parseFloat(durationSec.toFixed(2))}
        showSubtitle={showSubtitle} onSubtitleButtonClick={handleSubtitleButtonClick} {...controllerProps} />}
      {<LoadingIndicator isLoading={isLoading}/>}
    </Aspect16To9Container>
  )
}