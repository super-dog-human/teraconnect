import React from 'react'
import Aspect16To9Container from '../../aspect16To9Container'
import Titlebar from './titleBar'
import BackgroundImage from '../backgroundImage'
import Avatar from '../avatar'
import Drawing from '../drawing'
import Graphic from '../graphic'
import Subtitle from './subtitle'
import Caption from './caption'
import Controller from './controller'
import LoadingIndicator from './loadingIndicator'

export default function LessonPlayer(props) {
  const { isLoading, isPlaying, showTitleBar, showElapsedTime, title, durationSec, backgroundImageURL, graphic, subtitle, hahAvatars, hasDrawings, drawingRef, startDrawing, inDrawing, endDrawing, controllerInvisible, ...controllerProps } = props

  return (
    <Aspect16To9Container>
      {showTitleBar && <Titlebar isPlaying={isPlaying} controllerInvisible={controllerInvisible} title={title} />}
      {backgroundImageURL && <BackgroundImage url={backgroundImageURL} />}
      {hahAvatars && <Avatar />}
      {hasDrawings && <Drawing drawingRef={drawingRef} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} zKind='drawing' />}
      {graphic && <Graphic graphic={graphic}/>}
      {subtitle && <Caption caption={subtitle.caption} />}
      {subtitle && <Subtitle subtitle={subtitle.body} />}
      {!isLoading && <Controller isPlaying={isPlaying} showElapsedTime={showElapsedTime} controllerInvisible={controllerInvisible} maxTime={parseFloat(durationSec.toFixed(2))} {...controllerProps} />}
      {<LoadingIndicator isLoading={isLoading}/>}
    </Aspect16To9Container>
  )
}