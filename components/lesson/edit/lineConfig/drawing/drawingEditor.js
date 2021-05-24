import React, { useState, useRef, useEffect } from 'react'
import Flex from '../../../../flex'
import Spacer from '../../../../spacer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import SVGButton from '../../../../button/svgButton'
import Player from '../../../../lesson/player/'
import RecordingIcon from '../../../../recordingIcon'
import DrawingConfigButton from '../../../record/drawingController/drawingConfigButton'
import DrawingLineSelector from '../../../record/drawingController/drawingLineWidthSelector'
import { useLessonEditorContext } from '../../../../../libs/contexts/lessonEditorContext'
import useResizeDetector from '../../../../../libs/hooks/useResizeDetector'
import useLessonPlayer from '../../../../../libs/hooks/lesson/useLessonPlayer'
import useDrawingEditor from '../../../../../libs/hooks/lesson/edit/useDrawingEditor'
import useDrawingRecorder from '../../../../../libs/hooks/lesson/useDrawingRecorder'
import { deepCopy } from '../../../../../libs/utils'

import ColorPickerCube from '../../../../colorPickerCube'

export default function DrawingEditor({ config, setConfig, sameTimeIndex, isRecording, setIsRecording }) {
  const previewDurationSecRef = useRef(config.durationSec) // プレビューではdrawingsの時間だけ再生し、収録中はフル再生する
  const { bgImageURL, graphics, drawings, speeches } = useLessonEditorContext()
  const [previewDrawings, setPreviewDrawings] = useState(deepCopy(drawings))
  const containerRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const { drawingRef, isPlaying, setIsPlaying, isPreparing, isPlayerHover, getElapsedTime, playerElapsedTime, resetBeforeDrawing, handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart, handleSeekChange } =
    useLessonPlayer({ startElapsedTime: config.elapsedTime, durationSec: previewDurationSecRef.current, drawings: previewDrawings, speeches, sameTimeIndex })
  const { setRecord } = useDrawingEditor({ isRecording, setIsRecording, isPlaying, setIsPlaying, sameTimeIndex, startElapsedTime: config.elapsedTime, getElapsedTime, previewDurationSecRef,
    setConfig, previewDrawings, setPreviewDrawings })
  const { enablePen, setEnablePen, enableEraser, setEnableEraser, undoDrawing, drawingColor, setDrawingColor, drawingLineWidth, setDrawingLineWidth, startDrawing, inDrawing, endDrawing } = useDrawingRecorder({ hasResize, drawingRef, setRecord })

  function handleDrawingStart() {
    setIsRecording(state => !state)
  }

  function handleUndo() {
    resetBeforeDrawing()
    undoDrawing(true) // canvasをクリアせずに続きを描写する
  }

  function handlePen() {
    setEnablePen(state => !state)
  }

  function handleEraser() {
    setEnableEraser(state => !state)
  }

  function handleWidthChange(e) {
    setDrawingLineWidth(e.target.dataset.width)
  }

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
            <Flex>
              <Container width='28' height='28'>
                <SVGButton padding='3' disabled={isPlaying && !isRecording} onClick={handleDrawingStart}>
                  <RecordingIcon isRecording={isRecording} />
                </SVGButton>
              </Container>
              <Spacer width= '10' />
              <Flex>
                <DrawingConfigButton name='drawing' disabled={!isRecording} isSelected={enablePen && isRecording} onClick={handlePen} />
              </Flex>
            </Flex>
            <Spacer height='10' />
            <Flex>
              <Spacer width='38' />
              <DrawingConfigButton name='eraser' disabled={!isRecording} isSelected={enableEraser && isRecording} onClick={handleEraser} />
            </Flex>
            <Spacer height='10' />
            <Flex>
              <Spacer width='38' />
              <DrawingConfigButton name='undo' disabled={!isRecording} onClick={handleUndo} />
            </Flex>
            <Spacer height='15' />
            <Flex justifyContent='center'>
              <Container width='70'>
                <DrawingLineSelector height='2' lineWidth='5' selected={drawingLineWidth === '5'} onClick={handleWidthChange} />
                <DrawingLineSelector height='4' lineWidth='10' selected={drawingLineWidth === '10'} onClick={handleWidthChange} />
                <DrawingLineSelector height='7' lineWidth='20' selected={drawingLineWidth === '20'} onClick={handleWidthChange} />
              </Container>
            </Flex>
            <Spacer height='20' />
            <Flex>
              {!enableEraser &&
                <ColorPickerCube initialColor={drawingColor} onChange={setDrawingColor} size='20' />
              }
            </Flex>
          </ContainerSpacer>
        </Flex>
      </ContainerSpacer>
    </div>
  )
}