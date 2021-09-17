import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import Lesson from '../../components/lesson/index'
import fetchPublicLessonAsProps from '../../libs/middlewares/fetchPublicLessonAsProps'

const Page = ({ lesson, errorStatus }) => (
  <>
    <Head>
      <title>{lesson?.author?.name} の {lesson?.title} - TERACONNECT</title>
    </Head>
    <Layout>
      <Lesson lesson={lesson} errorStatus={errorStatus} />
    </Layout>
  </>
)

export default Page

export async function getServerSideProps(context) {
  return fetchPublicLessonAsProps(context)
}