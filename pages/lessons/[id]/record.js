/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import useRecordResource from '../../../components/lesson/record/useRecordResource'
import useRecorder from '../../../components/lesson/record/useRecorder'
import useLessonImage from '../../../components/lesson/record/useLessonImage'
import useVoiceRecorder from '../../../components/lesson/record/useVoiceRecorder'
import LessonRecordHeader from '../../../components/lesson/record/header/'
import LoadingIndicator from '../../../components/loadingIndicator'
import LessonBackgroundImage from '../../../components/lesson/backgroundImage'
import LessonAvatar from '../../../components/lesson/avatar'
import LessonImage from '../../../components/lesson/image'
import LessonRecordDrawing from '../../../components/lesson/record/drawing'
import LessonRecordSettingPanel from '../../../components/lesson/record/settingPanel/'
import LessonRecordImageController from '../../../components/lesson/record/imageController'
import LessonRecordRandomTips from '../../../components/lesson/record/randomTips'
import Footer from '../../../components/footer'
import requirePageAuth from '../../../components/requirePageAuth'
import { fetchWithAuth } from '../../../libs/fetch'
import { css } from '@emotion/core'

const Page = (props) => {
  const [loading, setLoading] = useState(true)
  const [bgImageURL, setBgImageURL] = useState()
  const [avatarConfig, setAvatarConfig] = useState({})
  const { bgImages, avatars, bgms } = useRecordResource(props.token, setBgImageURL, setAvatarConfig)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const { recording, startRecording, setRecord } = useRecorder(props.lesson.id, props.token, bgImageURL, avatarConfig)
  const { lessonImage, setLessonImage, uploadLessonImage } = useLessonImage(props.lesson.id, props.token)
  const { talking, setVoiceRecorderConfig } = useVoiceRecorder(props.lesson.id, props.token, recording, setRecord)
  const [drawingConfig, setDrawingConfig] = useState({ color: '#ff0000', lineWidth: 5 })
  const [hasResize, setHasResize] = useState()
  const containerRef = useRef(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver((e) => {
      const width = e[0].contentRect.width
      const height = e[0].contentRect.height
      setHasResize(width, height)
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
      <LessonRecordHeader recording={recording} startRecording={startRecording} setRecord={setRecord}
        drawingConfig={drawingConfig} setDrawingConfig={setDrawingConfig} setShowControlPanel={setShowControlPanel} />
      <main css={mainStyle}>
        <div css={bodyStyle} ref={containerRef}>
          <div css={loadingStyle}>
            <LoadingIndicator loading={loading}/>
          </div>
          <LessonBackgroundImage src={bgImageURL} />
          <LessonImage src={lessonImage} />
          <LessonAvatar config={avatarConfig} setLoading={setLoading} talking={talking} hasResize={hasResize} />
          <LessonRecordDrawing drawingConfig={drawingConfig} setRecord={setRecord} hasResize={hasResize} />
          <LessonRecordSettingPanel show={showControlPanel} setShow={setShowControlPanel} bgImages={bgImages} setBgImageURL={setBgImageURL}
            avatars={avatars} setAvatarConfig={setAvatarConfig} bgms={bgms} setVoiceRecorderConfig={setVoiceRecorderConfig}
            recording={recording} startRecording={startRecording} setRecord={setRecord} />
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