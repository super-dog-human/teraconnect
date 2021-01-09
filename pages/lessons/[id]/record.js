/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import useRecordResource from '../../../libs/hooks/lesson/record/useRecordResource'
import useRecorder from '../../../libs/hooks/lesson/record/useRecorder'
import useLessonImage from '../../../libs/hooks/lesson/useImage'
import useVoiceRecorder from '../../../libs/hooks/lesson/record/useVoiceRecorder'
import useDrawing from '../../../libs/hooks/lesson/useDrawing'
import LessonRecordHeader from '../../../components/lesson/record/header/'
import LoadingIndicator from '../../../components/loadingIndicator'
import LessonBackgroundImage from '../../../components/lesson/backgroundImage'
import LessonAvatar from '../../../components/lesson/avatar'
import LessonImage from '../../../components/lesson/image'
import LessonDrawing from '../../../components/lesson/drawing'
import LessonRecordSettingPanel from '../../../components/lesson/record/settingPanel/'
import LessonRecordImageController from '../../../components/lesson/record/imageController'
import LessonRecordRandomTips from '../../../components/lesson/record/randomTips'
import Footer from '../../../components/footer'
import requirePageAuth from '../../../components/requirePageAuth'
import { fetchWithAuth } from '../../../libs/fetch'
import { css } from '@emotion/core'

const Page = (props) => {
  const [hasResize, setHasResize] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [bgImageURL, setBgImageURL] = useState()
  const [avatarConfig, setAvatarConfig] = useState({})
  const { bgImages, avatars, bgms } = useRecordResource(props.token, setBgImageURL, setAvatarConfig)
  const [isShowControlPanel, setIsShowControlPanel] = useState(false)
  const [isDrawingHide, setIsDrawingHide] = useState(false)
  const { isRecording, setIsRecording, setRecord } = useRecorder(props.lesson.id, props.token, bgImageURL, avatarConfig)
  const { lessonImage, setLessonImage, uploadLessonImage } = useLessonImage(props.lesson.id, props.token)
  const { isTalking, setVoiceRecorderConfig } = useVoiceRecorder(props.lesson.id, props.token, isRecording, setRecord)
  const { undoDrawing, clearDrawing, drawingColor, setDrawingColor, drawingLineWidth, setDrawingLineWidth,
    startDrawing, inDrawing, endDrawing, drawingRef } = useDrawing(setRecord, hasResize)
  const containerRef = useRef(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(e => {
      setHasResize({ width: e[0].contentRect.width, height: e[0].contentRect.height })
    })

    containerRef.current && resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <>
      <Head>
        <title>{props.lesson.title}の収録 - TERACONNECT</title>
      </Head>
      <LessonRecordHeader isRecording={isRecording} setIsRecording={setIsRecording} setRecord={setRecord}
        isDrawingHide={isDrawingHide} setIsDrawingHide={setIsDrawingHide}
        undoDrawing={undoDrawing} clearDrawing={clearDrawing}
        drawingColor={drawingColor} setDrawingColor={setDrawingColor}
        drawingLineWidth={drawingLineWidth} setDrawingLineWidth={setDrawingLineWidth}
        setIsShowControlPanel={setIsShowControlPanel} />
      <main css={mainStyle}>
        <div css={bodyStyle} ref={containerRef}>
          <div css={loadingStyle}>
            <LoadingIndicator isLoading={isLoading}/>
          </div>
          <LessonBackgroundImage src={bgImageURL} />
          <LessonImage src={lessonImage} />
          <LessonAvatar config={avatarConfig} setIsLoading={setIsLoading} isTalking={isTalking} hasResize={hasResize} />
          <LessonDrawing isHide={isDrawingHide} startDrawing={startDrawing} inDrawing={inDrawing} endDrawing={endDrawing} drawingRef={drawingRef}  />
          <LessonRecordSettingPanel isShow={isShowControlPanel} setIsShow={setIsShowControlPanel} bgImages={bgImages} setBgImageURL={setBgImageURL}
            avatars={avatars} setAvatarConfig={setAvatarConfig} bgms={bgms} setVoiceRecorderConfig={setVoiceRecorderConfig}
            setRecord={setRecord} />
        </div>
        <LessonRecordImageController setLessonImage={setLessonImage} uploadImage={uploadLessonImage} setRecord={setRecord} />
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

const loadingStyle = css({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: '100%',
})