/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import Head from 'next/head'
import { LessonRecorderProvider } from '../../../libs/contexts/lessonRecorderContext'
import usePreventBack from '../../../libs/hooks/lesson/record/usePreventBack'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import LessonRecord from '../../../components/lesson/record/'
import Footer from '../../../components/footer'
import requirePageAuth from '../../../components/requirePageAuth'
import { fetchWithAuth } from '../../../libs/fetch'

const Page = ({ token, lesson }) => {
  usePreventBack()
  const containerRef = useRef(null)
  const { hasResize } = useResizeDetector(containerRef)

  return (
    <>
      <Head>
        <title>{lesson.title}の収録 - TERACONNECT</title>
      </Head>
      <LessonRecorderProvider>
        <LessonRecord token={token} lesson={lesson} ref={containerRef} hasResize={hasResize} />
      </LessonRecorderProvider>
      <Footer />
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  const authProps = await requirePageAuth(context)
  const id = context.query.id
  const lesson = await fetchWithAuth(`/lessons/${id}?for_authoring=true`, authProps.props.token).catch(e => {
    if (e.response.status === '401') {
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