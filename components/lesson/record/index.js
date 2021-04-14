/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useLessonRecorderContext } from '../../../libs/contexts/lessonRecorderContext'
import useLessonRecordChangeTabDetector from '../../../libs/hooks/lesson/record/useChangeTabDetector'
import useRecordResource from '../../../libs/hooks/lesson/record/useRecordResource'
import useDragOverDetector from '../../../libs/hooks/useDragOverDetector'
import useLessonAvatar from '../../../libs/hooks/lesson/useAvatar'
import useLessonDrawing from '../../../libs/hooks/lesson/useDrawing'
import useVoiceRecorder from '../../../libs/hooks/lesson/useVoiceRecorder'
import LessonRecordHeader from './header'
import LessonRecordLoadingIndicator from './loadingIndicator'
import LessonRecordSettingPanel from './settingPanel'
import LessonRecordGraphicController from './graphicController'
import LessonBackgroundImage from '../backgroundImage'
import LessonAvatar from '../avatar'
import LessonGraphic from '../graphic'
import LessonDrawing from '../drawing'
import LessonRandomTips from '../randomTips'
import VoiceSpectrum from '../../voiceSpectrum'
import { addPreventSwipeEvent, removePreventSwipeEvent } from '../../../libs/utils'

const LessonRecord = React.forwardRef(function lessonRecord({ lesson, hasResize }, ref) {
  const { isRecording, realElapsedTime } = useLessonRecorderContext()
  const [isLoading, setIsLoading] = useState(true)
  const [bgImageURL, setBgImageURL] = useState()
  const [selectedGraphic, setSelectedGraphic] = useState()
  const [isShowControlPanel, setIsShowControlPanel] = useState(false)
  const [isShowVoiceSpectrum, setIsShowVoiceSpectrum] = useState(true)
  useLessonRecordChangeTabDetector()
  const { hasDragOver, handleAreaDragOver, handleAreaDragLeave, handleAreaDrop } = useDragOverDetector()
  const { bgImages, avatars, bgms } = useRecordResource(setBgImageURL)
  const { isMicReady, isSpeaking, micDeviceID, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec } = useVoiceRecorder({ lessonID: lesson.id, isRecording, realElapsedTime })
  const { setAvatarConfig, avatarRef, startDragging, inDragging, endDragging } = useLessonAvatar(setIsLoading, isSpeaking, hasResize)
  const { isDrawingHide, setIsDrawingHide, enablePen, setEnablePen, undoDrawing, clearDrawing, drawingColor, setDrawingColor, setDrawingLineWidth,
    startDrawing, inDrawing, endDrawing, drawingRef } = useLessonDrawing(hasResize, startDragging, inDragging, endDragging)

  useEffect(() => {
    addPreventSwipeEvent()
    return () => {
      removePreventSwipeEvent()
    }
  }, [])

  return (
    <>
      <LessonRecordHeader lessonID={lesson.id} isMicReady={isMicReady} isDrawingHide={isDrawingHide} setIsDrawingHide={setIsDrawingHide}
        enablePen={enablePen} setEnablePen={setEnablePen} undoDrawing={undoDrawing} clearDrawing={clearDrawing} drawingColor={drawingColor} setDrawingColor={setDrawingColor}
        setDrawingLineWidth={setDrawingLineWidth} setIsShowControlPanel={setIsShowControlPanel} />
      <main css={mainStyle} onDragOver={handleAreaDragOver} onDragLeave={handleAreaDragLeave} onDrop={handleAreaDrop} ref={ref}>
        <div css={bodyStyle}>
          <LessonRecordLoadingIndicator isLoading={isLoading} size={15} />
          <VoiceSpectrum micDeviceID={micDeviceID} isShow={isShowVoiceSpectrum} setIsShow={setIsShowVoiceSpectrum} />
          <LessonBackgroundImage src={bgImageURL} />
          <LessonGraphic graphic={selectedGraphic} />
          <LessonAvatar ref={avatarRef} onMouseDown={startDragging} onMouseMove={inDragging} onMouseUp={endDragging} onMouseLeave={endDragging}
            onTouchStart={startDragging} onTouchMove={inDragging} onTouchEnd={endDragging} onTouchCancel={endDragging} />
          <LessonDrawing isHide={isDrawingHide} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} drawingRef={drawingRef} />
          <LessonRecordSettingPanel isShow={isShowControlPanel} setIsShow={setIsShowControlPanel} bgImages={bgImages} setBgImageURL={setBgImageURL}
            avatars={avatars} setAvatarConfig={setAvatarConfig} bgms={bgms} setMicDeviceID={setMicDeviceID} silenceThresholdSec={silenceThresholdSec}
            setSilenceThresholdSec={setSilenceThresholdSec} isShowVoiceSpectrum={isShowVoiceSpectrum} setIsShowVoiceSpectrum={setIsShowVoiceSpectrum} />
        </div>
        <LessonRecordGraphicController id={lesson.id} setSelectedGraphic={setSelectedGraphic} hasDragOver={hasDragOver} />
        <LessonRandomTips />
      </main>
    </>
  )
})

export default LessonRecord

const mainStyle = css({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--back-movie-black)',
  userSelect: 'none',
})

const bodyStyle = css({
  position: 'relative',
  margin: 'auto',
  maxWidth: '1280px',
  maxHeight: '720px',
})