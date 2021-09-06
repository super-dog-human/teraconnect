import React, { useState, useRef, useEffect } from 'react'
import Flex from '../../../../flex'
import Spacer from '../../../../spacer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import SVGButton from '../../../../button/svgButton'
import LessonPlayer from '../../../../lesson/player/'
import ColorPickerCube from '../../../../colorPickerCube'
import RecordingIcon from '../../../../recordingIcon'
import DrawingConfigButton from '../../../record/drawingController/drawingConfigButton'
import DrawingLineSelector from '../../../record/drawingController/drawingLineWidthSelector'
import ActionSelector from './actionSelector'
import { useLessonEditorContext } from '../../../../../libs/contexts/lessonEditorContext'
import useResizeDetector from '../../../../../libs/hooks/useResizeDetector'
import useLessonPlayer from '../../../../../libs/hooks/lesson/useLessonPlayer'
import useDrawingEditor from '../../../../../libs/hooks/lesson/edit/useDrawingEditor'
import useDrawingRecorder from '../../../../../libs/hooks/lesson/useDrawingRecorder'

export default function DrawingEditor({ config, selectedAction, setSelectedAction, startElapsedTime, sameTimeIndex, isRecording, setIsRecording, drawings, setDrawings }) {
  const [graphicURLs, setGraphicURLs] = useState({})
  const previewDurationSecRef = useRef(config.durationSec) // プレビューではdrawingsの時間だけ再生し、収録中は最大収録時間まで再生する
  const { generalSetting, graphics, graphicURLs: originalGraphicURLs } = useLessonEditorContext()
  const containerRef = useRef()
  const { hasResize } = useResizeDetector(containerRef)
  const { drawingRef, isPlaying, startPlaying, stopPlaying, getElapsedTime, resetBeforeUndo, handleSeekChange, ...playerProps } =
    useLessonPlayer({ startElapsedTime, durationSec: previewDurationSecRef.current, drawings, graphics, graphicURLs, sameTimeIndex })
  const { startRecording, stopRecording, setRecord } = useDrawingEditor({ isRecording, setIsRecording, isPlaying, startPlaying, stopPlaying, sameTimeIndex, startElapsedTime, getElapsedTime, previewDurationSecRef, drawings, setDrawings })
  const { enablePen, setEnablePen, enableEraser, setEnableEraser, undoDrawing, drawingColor, setDrawingColor, drawingLineWidth, setDrawingLineWidth, startDrawing, inDrawing, endDrawing, resetHistories } = useDrawingRecorder({ hasResize, drawingRef, setRecord })

  function handlePlayButtonClick() {
    if (isPlaying) {
      stopPlaying()
    } else {
      startPlaying()
    }
  }

  function handleRecording() {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
      resetHistories()
    }
  }

  function handleUndo() {
    resetBeforeUndo()
    undoDrawing(true) // canvasをクリアせずに続きを描写する
  }

  function handlePen() {
    setEnablePen(state => !state)
  }

  function handleEraser() {
    setEnableEraser(state => !state)
  }

  function handleWidthChange(e) {
    setDrawingLineWidth(parseInt(e.target.dataset.width))
  }

  useEffect(() => {
    setGraphicURLs(Object.keys(originalGraphicURLs)
      .reduce((newObj, key) => ({ ...newObj, [key]: originalGraphicURLs[key].url }), {}))
  }, [originalGraphicURLs])

  return (
    <div ref={containerRef}>
      <ContainerSpacer left='50' right='50'>
        <Container width='500'>
          <ActionSelector initialAction='draw' selectedAction={selectedAction} setSelectedAction={setSelectedAction} disabled={isRecording} />
        </Container>
        <Spacer height= '25' />
        <Container invisible={selectedAction !== 'draw'}>
          <Flex>
            <Container width='500' height='281'>
              <LessonPlayer isPlaying={isPlaying} durationSec={previewDurationSecRef.current} backgroundImageURL={generalSetting.backgroundImageURL}
                hasDrawings={true} drawingRef={drawingRef} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing}
                onPlayButtonClick={handlePlayButtonClick} onSeekChange={handleSeekChange} disabledControl={isRecording} {...playerProps} />
            </Container>
            <ContainerSpacer top='10' left='20'>
              <Flex>
                <Container width='28' height='28'>
                  <SVGButton padding='3' disabled={isPlaying && !isRecording} onClick={handleRecording}>
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
              <Spacer height='30' />
              <Flex justifyContent='center'>
                <Container width='70'>
                  <DrawingLineSelector height='2' lineWidth='5' selected={drawingLineWidth === 5} onClick={handleWidthChange} />
                  <DrawingLineSelector height='4' lineWidth='10' selected={drawingLineWidth === 10} onClick={handleWidthChange} />
                  <DrawingLineSelector height='7' lineWidth='20' selected={drawingLineWidth === 20} onClick={handleWidthChange} />
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
        </Container>
      </ContainerSpacer>
    </div>
  )
}