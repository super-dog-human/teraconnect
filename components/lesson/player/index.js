import React from 'react'
import Aspect16To9Container from '../../aspect16To9Container'
import BackgroundImage from '../backgroundImage'
import Avatar from '../avatar'
import Drawing from '../drawing'
import Graphic from '../graphic'
import Controller from './controller'

export default function LessonPlayer(props) {
  const { isPreparing, durationSec, backgroundImageURL, avatars, graphics, drawings, drawingRef, startDrawing, inDrawing, endDrawing, ...controllerProps } = props

  return (
    <Aspect16To9Container>
      {isPreparing && <div>声の準備中</div>}
      {backgroundImageURL && <BackgroundImage url={backgroundImageURL} />}
      {avatars && <Avatar />}
      {drawings && <Drawing drawingRef={drawingRef} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} zKind='drawing' />}
      {graphics && <Graphic />}
      <Controller maxTime={parseFloat(durationSec.toFixed(2))} {...controllerProps} />
    </Aspect16To9Container>
  )
}