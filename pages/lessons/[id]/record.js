import React, { useRef } from 'react'
import Head from 'next/head'
import { LessonRecorderProvider } from '../../../libs/contexts/lessonRecorderContext'
import usePreventBack from '../../../libs/hooks/lesson/record/usePreventBack'
import useResizeDetector from '../../../libs/hooks/useResizeDetector'
import LessonRecord from '../../../components/lesson/record/'
import Footer from '../../../components/footer'
import requirePageAuth from '../../../libs/middlewares/requirePageAuth'
import fetchLessonAsProps from '../../../libs/middlewares/fetchLessonAsProps'
import useSessionExpireChecker from '../../../libs/hooks/useTokenExpireChecker'

const Page = ({ lesson }) => {
  usePreventBack()
  useSessionExpireChecker()
  const containerRef = useRef(null)
  const { hasResize } = useResizeDetector(containerRef)

  return (
    <>
      <Head>
        <title>{lesson.title}の収録 - TERACONNECT</title>
      </Head>
      <div>
        <LessonRecorderProvider>
          <LessonRecord lesson={lesson} ref={containerRef} hasResize={hasResize} />
        </LessonRecorderProvider>
      </div>
      <Footer />
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  const authProps = await requirePageAuth(context)
  return fetchLessonAsProps(context, authProps.props)
}