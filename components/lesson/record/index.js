/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/react'
import { useLessonRecorderContext } from '../../../libs/contexts/lessonRecorderContext'
import usePreventBack from '../../../libs/hooks/lesson/record/usePreventBack'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import useTouchDeviceDetector from '../../../libs/hooks/useTouchDeviceDetector'
import useSessionExpireChecker from '../../../libs/hooks/useTokenExpireChecker'
import useLessonRecordChangeTabDetector from '../../../libs/hooks/lesson/record/useChangeTabDetector'
import useRecordResource from '../../../libs/hooks/lesson/record/useRecordResource'
import useLesson from '../../../libs/hooks/lesson/useLesson'
import useDragOverDetector from '../../../libs/hooks/useDragOverDetector'
import useAvatar from '../../../libs/hooks/lesson/useAvatar'
import useDrawingRecorder from '../../../libs/hooks/lesson/useDrawingRecorder'
import useAudioVisualizer from '../../../libs/hooks/useAudioVisualizer'
import useVoiceRecorder from '../../../libs/hooks/lesson/useVoiceRecorder'
import Aspect16To9Container from '../../aspect16To9Container'
import LessonRecordHeader from './header'
import LoadingIndicator from './loadingIndicator'
import SettingPanel from './settingPanel'
import LessonRecordGraphicController from './graphicController'
import LessonBackgroundImage from '../backgroundImage'
import LessonAvatar from '../avatar'
import LessonGraphic from '../graphic'
import LessonDrawing from '../drawing'
import RandomTips from './randomTips'
import VoiceSpectrum from '../../voiceSpectrum'
import { addPreventSwipeEvent, removePreventSwipeEvent } from '../../../libs/utils'

const LessonRecord = ({ lessonID }) => {
  usePreventBack()
  useSessionExpireChecker()
  useLessonRecordChangeTabDetector()
  const containerRef = useRef(null)
  const drawingRef = useRef()
  const lesson = useLesson(lessonID)
  const { hasResize } = useResizeDetector(containerRef)
  const isTouchDevice = useTouchDeviceDetector()
  const [isLoading, setIsLoading] = useState(true)
  const [bgImageURL, setBgImageURL] = useState()
  const [selectedGraphic, setSelectedGraphic] = useState()
  const [isShowControlPanel, setIsShowControlPanel] = useState(false)
  const [isShowVoiceSpectrum, setIsShowVoiceSpectrum] = useState(true)
  const { isRecording, realElapsedTime, setRecord } = useLessonRecorderContext()
  const { hasDragOver, handleAreaDragOver, handleAreaDragLeave, handleAreaDrop } = useDragOverDetector()
  const { bgImages, avatars, graphics } = useRecordResource({ lessonID, setBgImageURL })
  const { createAnalyzer, canvasRef: audioVisualizerRef } = useAudioVisualizer()
  const { isMicReady, isSpeaking, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec } = useVoiceRecorder({ lessonID, isRecording, realElapsedTime, createAnalyzer })
  const { setAvatarConfig, avatarRef, startDragging, inDragging, endDragging, cleanAvatar } = useAvatar({ setIsLoading, isSpeaking, hasResize, movingCallback: setRecord })
  const { isDrawingHide, setIsDrawingHide, enablePen, setEnablePen, enableEraser, setEnableEraser, undoDrawing, clearDrawing, drawingColor, setDrawingColor, drawingLineWidth, setDrawingLineWidth,
    startDrawing, inDrawing, endDrawing } = useDrawingRecorder({ hasResize, drawingRef, startDragging, inDragging, endDragging, setRecord })

  useEffect(() => {
    addPreventSwipeEvent()
    return () => {
      removePreventSwipeEvent()
    }
  }, [])

  return (
    <>
      <LessonRecordHeader lessonID={lessonID} materialID={lesson?.materialID} isMicReady={isMicReady} isDrawingHide={isDrawingHide} setIsDrawingHide={setIsDrawingHide}
        enablePen={enablePen} setEnablePen={setEnablePen} enableEraser={enableEraser} setEnableEraser={setEnableEraser} undoDrawing={undoDrawing} clearDrawing={clearDrawing} drawingColor={drawingColor} setDrawingColor={setDrawingColor}
        drawingLineWidth={drawingLineWidth} setDrawingLineWidth={setDrawingLineWidth} isShowControlPanel={isShowControlPanel} setIsShowControlPanel={setIsShowControlPanel} />
      <main css={mainStyle} onDragOver={handleAreaDragOver} onDragLeave={handleAreaDragLeave} onDrop={handleAreaDrop} ref={containerRef}>
        <div css={backgroundStyle}>
          <div css={bodyStyle}>
            <Aspect16To9Container>
              <LoadingIndicator isLoading={isLoading} size={15} />
              <VoiceSpectrum isShow={isShowVoiceSpectrum} setIsShow={setIsShowVoiceSpectrum} canvasRef={audioVisualizerRef} />
              <LessonBackgroundImage url={bgImageURL} />
              <LessonGraphic graphic={selectedGraphic} />
              <LessonAvatar ref={avatarRef} onMouseDown={startDragging} onMouseMove={inDragging} onMouseUp={endDragging} onMouseLeave={endDragging}
                onTouchStart={startDragging} onTouchMove={inDragging} onTouchEnd={endDragging} onTouchCancel={endDragging} />
              <LessonDrawing isHide={isDrawingHide} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} drawingRef={drawingRef} zKind='drawing' />
              <SettingPanel isShow={isShowControlPanel} setIsShow={setIsShowControlPanel} bgImages={bgImages} setBgImageURL={setBgImageURL}
                avatars={avatars} setAvatarConfig={setAvatarConfig} cleanAvatar={cleanAvatar} setMicDeviceID={setMicDeviceID} silenceThresholdSec={silenceThresholdSec}
                setSilenceThresholdSec={setSilenceThresholdSec} isShowVoiceSpectrum={isShowVoiceSpectrum} setIsShowVoiceSpectrum={setIsShowVoiceSpectrum} />
            </Aspect16To9Container>
          </div>
        </div>
        <LessonRecordGraphicController lessonID={lessonID} setSelectedGraphic={setSelectedGraphic} initialGraphics={graphics} hasDragOver={hasDragOver} isTouchDevice={isTouchDevice} />
        <RandomTips />
      </main>
    </>
  )
}

export default LessonRecord

const mainStyle = css({
  position: 'relative',
  width: '100%',
  height: '100%',
  marginTop: '60px',
  backgroundColor: 'var(--bg-light-gray)',
  userSelect: 'none',
})

const backgroundStyle = css({
  backgroundColor: 'var(--back-movie-black)',
})

const bodyStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
})