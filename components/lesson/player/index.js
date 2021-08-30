import React from 'react'
import Aspect16To9Container from '../../aspect16To9Container'
import BackgroundImage from '../backgroundImage'
import Avatar from '../avatar'
import Drawing from '../drawing'
import Graphic from '../graphic'
import Controller from './controller'
import LoadingIndicator from './loadingIndicator'

export default function LessonPlayer(props) {
  const { isLoading, durationSec, backgroundImageURL, graphic, hahAvatars, hasGraphics, hasDrawings, drawingRef, startDrawing, inDrawing, endDrawing, ...controllerProps } = props

  return (
    <Aspect16To9Container>
      {backgroundImageURL && <BackgroundImage url={backgroundImageURL} />}
      {hahAvatars && <Avatar />}
      {hasDrawings && <Drawing drawingRef={drawingRef} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} zKind='drawing' />}
      {hasGraphics && <Graphic graphic={graphic}/>}
      {!isLoading && <Controller maxTime={parseFloat(durationSec.toFixed(2))} {...controllerProps} />}
      {<LoadingIndicator isLoading={isLoading}/>}
    </Aspect16To9Container>
  )
}