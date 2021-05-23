import React, { useState, useRef, useEffect } from 'react'
import Flex from '../../../../flex'
import Spacer from '../../../../spacer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import SVGButton from '../../../../button/svgButton'
import Player from '../../../../lesson/player/'
import RecordingIcon from '../../../../recordingIcon'
import DrawingConfigButton from '../../../record/drawingController/drawingConfigButton'
import DrawingConfigPanel from '../../../record/drawingController/drawingConfigPanel'
import { useLessonEditorContext } from '../../../../../libs/contexts/lessonEditorContext'
import useResizeDetector from '../../../../../libs/hooks/useResizeDetector'
import useLessonPlayer from '../../../../../libs/hooks/lesson/useLessonPlayer'
import useDrawingEditor from '../../../../../libs/hooks/lesson/edit/useDrawingEditor'
import useDrawingRecorder from '../../../../../libs/hooks/lesson/useDrawingRecorder'
import { deepCopy } from '../../../../../libs/utils'

export default function DrawingEditor({ config, setConfig, sameTimeIndex, isRecording, setIsRecording }) {
  const previewDurationSecRef = useRef(config.durationSec) // プレビューではdrawingsの時間だけ再生し、収録中はフル再生する
  const { durationSec: fullDurationSec, bgImageURL, graphics, drawings, speeches } = useLessonEditorContext()
  const [previewDrawings, setPreviewDrawings] = useState(deepCopy(drawings))
  const containerRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const { drawingRef, isPlaying, setIsPlaying, isPreparing, isPlayerHover, getElapsedTime, playerElapsedTime, handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart, handleSeekChange } =
    useLessonPlayer({ startElapsedTime: config.elapsedTime, durationSec: previewDurationSecRef.current, drawings: previewDrawings, speeches, sameTimeIndex })
  const { setRecord } = useDrawingEditor({ isRecording, setIsRecording, isPlaying, setIsPlaying, sameTimeIndex, startElapsedTime: config.elapsedTime, getElapsedTime, previewDurationSecRef, fullDurationSec,
    setConfig, previewDrawings, setPreviewDrawings })
  const { enablePen, setEnablePen, undoDrawing, drawingColor, setDrawingColor, setDrawingLineWidth, startDrawing, inDrawing, endDrawing } = useDrawingRecorder({ hasResize, drawingRef, setRecord })

  function handleDrawingStart() {
    if (isRecording) {
      setEnablePen(false)
      setIsRecording(false)
    } else {
      setIsRecording(true)
    }
  }

  function handlePen() {
    setEnablePen(state => !state)
  }

  useEffect(() => {
    return () => {
      // プレイヤーの時間系をリセットする必要がある？
    }
  }, [])

  return (
    <div ref={containerRef}>
      <ContainerSpacer left='50' right='50'>
        <Flex>
          <Container width='500' height='281'>
            <Player isPreparing={isPreparing} durationSec={previewDurationSecRef.current} bgImageURL={bgImageURL} graphics={graphics} drawings={drawings}
              drawingRef={drawingRef} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing}
              isPlayerHover={isPlayerHover} controllerInvisible={!isPlayerHover} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onPlayButtonClick={handlePlayButtonClick}
              disabledControl={isRecording} playerElapsedTime={playerElapsedTime}
              maxTime={parseFloat(previewDurationSecRef.current.toFixed(2))} onDragStart={handleDragStart} onSeekChange={handleSeekChange} />
          </Container>
          <ContainerSpacer top='30' left='20'>
            <Container width='28' height='28'>
              <SVGButton padding='3' disabled={isPlaying && !isRecording} onClick={handleDrawingStart}>
                <RecordingIcon isRecording={isRecording} />
              </SVGButton>
            </Container>
            <Spacer height='15' />
            <Flex>
              <DrawingConfigButton name='drawing' disabled={!isRecording} isSelected={enablePen} onClick={handlePen} />
              <DrawingConfigPanel disabled={!isRecording} color={drawingColor} setColor={setDrawingColor} setLineWidth={setDrawingLineWidth} setEnablePen={setEnablePen} />
            </Flex>
            <Spacer height='15' />
            <DrawingConfigButton name='undo' disabled={!isRecording} onClick={undoDrawing} />
          </ContainerSpacer>
        </Flex>
      </ContainerSpacer>
    </div>
  )
}