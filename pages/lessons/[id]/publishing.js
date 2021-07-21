import React from 'react'
import Head from 'next/head'
import LessonPublishing from '../../../components/lesson/publishing'
import requirePageAuth from '../../../libs/middlewares/requirePageAuth'
import fetchLessonAsProps from '../../../libs/middlewares/fetchLessonAsProps'
import fetchLessonMaterialAsProps from '../../../libs/middlewares/fetchLessonMaterialAsProps'
import Footer from '../../../components/footer'
import { ContextMenuProvider } from '../../../libs/contexts/contextMenuContext'
import useSessionExpireChecker from '../../../libs/hooks/useTokenExpireChecker'

const Page = ({ lesson, material }) => {
  useSessionExpireChecker()

  return (
    <>
      <Head>
        <title>{lesson.title}の公開設定 - TERACONNECT</title>
      </Head>
      <ContextMenuProvider>
        <LessonPublishing lesson={lesson} material={material} />
      </ContextMenuProvider>
      <Footer />
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  const authProps = await requirePageAuth(context)
  const lessonProps = await fetchLessonAsProps(context, authProps.props)
  const materialID = lessonProps.props.lesson.materialID
  return fetchLessonMaterialAsProps({ context, materialID, isShort: true, props: lessonProps.props })
}