/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from 'react'
import useRecordResource from '../../../libs/hooks/lesson/record/useRecordResource'
import useRecorder from '../../../libs/hooks/lesson/record/useRecorder'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import useDragOverDetector from '../../../libs/hooks/useDragOverDetector'
import usePreventBack from '../../../libs/hooks/lesson/record/usePreventBack'
import useLessonAvatar from '../../../libs/hooks/lesson/useAvatar'
import useVoiceRecorder from '../../../libs/hooks/lesson/record/useVoiceRecorder'
import useLessonDrawing from '../../../libs/hooks/lesson/useDrawing'
import Head from 'next/head'
import LessonRecordHeader from '../../../components/lesson/record/header/'
import LessonRecordLoadingIndicator from '../../../components/lesson/record/loadingIndicator'
import LessonRecordVoiceSpectrum from '../../../components/lesson/record/voiceSpectrum'
import LessonBackgroundImage from '../../../components/lesson/backgroundImage'
import LessonAvatar from '../../../components/lesson/avatar'
import LessonImage from '../../../components/lesson/image'
import LessonDrawing from '../../../components/lesson/drawing'
import LessonRecordSettingPanel from '../../../components/lesson/record/settingPanel/'
import LessonRecordImageController from '../../../components/lesson/record/imageController/'
import LessonRecordRandomTips from '../../../components/lesson/record/randomTips'
import Footer from '../../../components/footer'
import requirePageAuth from '../../../components/requirePageAuth'
import { fetchWithAuth } from '../../../libs/fetch'
import { css } from '@emotion/core'

const Page = ({ token, lesson }) => {
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [bgImageURL, setBgImageURL] = useState()
  const [selectedImage, setSelectedImage] = useState()
  const [isShowControlPanel, setIsShowControlPanel] = useState(false)
  const [isShowVoiceSpectrum, setIsShowVoiceSpectrum] = useState(true)
  usePreventBack()
  const { setRecord } = useRecorder(lesson.id, token, isRecording)
  const { hasResize } = useResizeDetector(containerRef)
  const  { hasDragOver, handleAreaDragOver, handleAreaDragLeave, handleAreaDrop } = useDragOverDetector()
  const { bgImages, avatars, bgms } = useRecordResource(token, setBgImageURL)
  const { isMicReady, isSpeaking, micDeviceID, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec } = useVoiceRecorder(lesson.id, token, isRecording, setRecord)
  const { setAvatarConfig, avatarRef, startDragging, inDragging, endDragging } = useLessonAvatar(setIsLoading, isSpeaking, hasResize, setRecord)
  const { isDrawingHide, setIsDrawingHide, enablePen, setEnablePen, undoDrawing, clearDrawing, drawingColor, setDrawingColor, setDrawingLineWidth,
    startDrawing, inDrawing, endDrawing, drawingRef } = useLessonDrawing(setRecord, hasResize, startDragging, inDragging, endDragging)

  return (
    <>
      <Head>
        <title>{lesson.title}の収録 - TERACONNECT</title>
      </Head>
      <LessonRecordHeader isMicReady={isMicReady} isRecording={isRecording} setIsRecording={setIsRecording} setRecord={setRecord}
        isDrawingHide={isDrawingHide} setIsDrawingHide={setIsDrawingHide} enablePen={enablePen} setEnablePen={setEnablePen}
        undoDrawing={undoDrawing} clearDrawing={clearDrawing} drawingColor={drawingColor} setDrawingColor={setDrawingColor}
        setDrawingLineWidth={setDrawingLineWidth} setIsShowControlPanel={setIsShowControlPanel} />
      <main css={mainStyle} onDragOver={handleAreaDragOver} onDragLeave={handleAreaDragLeave} onDrop={handleAreaDrop} ref={containerRef}>
        <div css={bodyStyle}>
          <LessonRecordLoadingIndicator isLoading={isLoading} size={15} />
          <LessonRecordVoiceSpectrum micDeviceID={micDeviceID} isShow={isShowVoiceSpectrum} setIsShow={setIsShowVoiceSpectrum} />
          <LessonBackgroundImage src={bgImageURL} />
          <LessonImage image={selectedImage} />
          <LessonAvatar ref={avatarRef} onMouseDown={startDragging} onMouseMove={inDragging} onMouseUp={endDragging} onMouseLeave={endDragging} />
          <LessonDrawing isHide={isDrawingHide} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} drawingRef={drawingRef}  />
          <LessonRecordSettingPanel isShow={isShowControlPanel} setIsShow={setIsShowControlPanel} bgImages={bgImages} setBgImageURL={setBgImageURL}
            avatars={avatars} setAvatarConfig={setAvatarConfig} bgms={bgms} setMicDeviceID={setMicDeviceID} silenceThresholdSec={silenceThresholdSec}
            setSilenceThresholdSec={setSilenceThresholdSec} isShowVoiceSpectrum={isShowVoiceSpectrum} setIsShowVoiceSpectrum={setIsShowVoiceSpectrum}
            setRecord={setRecord} />
        </div>
        <LessonRecordImageController id={lesson.id} token={token} setSelectedImage={setSelectedImage} setRecord={setRecord} hasDragOver={hasDragOver} />
        <LessonRecordRandomTips />
      </main>
      <Footer />
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  const authProps = await requirePageAuth(context)
  const id = context.query.id

  const lesson = await fetchWithAuth(`/lessons/${id}?for_authoring=true`, authProps.props.token)
    .then(r => r)
    .catch(e => {
      if (e.responseCode === '401') {
        context.res.writeHead(307, { Location: '/login' })
        context.res.end()
      } else {
        throw e
      }
    })

  return { props: {
    ...authProps.props,
    lesson,
  } }
}

const mainStyle = css({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--back-movie-black)',
  userSelect: 'none',
})

const bodyStyle = css({
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  maxWidth: '1280px',
  maxHeight: '720px',
})