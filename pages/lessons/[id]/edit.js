import React, { useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../../components/layout'
import useLessonEditor from '../../../libs/hooks/lesson/edit/useLessonEditor'
import requirePageAuth from '../../../libs/requirePageAuth'
import fetchLessonAsProps from '../../../libs/fetchLessonAsProps'

const Page = ({ token, lesson }) => {
  useLessonEditor(lesson.id, token)

  useEffect(() => {

  }, [])

  return (
    <>
      <Head>
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <div>edit lesson page.</div>
      </Layout>
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  const authProps = await requirePageAuth(context)
  return fetchLessonAsProps(context, authProps.props)
}