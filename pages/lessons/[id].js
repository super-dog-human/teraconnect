import React from 'react'
import Head from 'next/head'
import Footer from '../../components/footer'
import Lesson from '../../components/lesson/index'
import fetchPublicLessonAsProps from '../../libs/middlewares/fetchPublicLessonAsProps'

const Page = ({ lesson, errorStatus }) => (
  <>
    <Head>
      <title>{lesson?.title} - TERACONNECT</title>
    </Head>
    <Lesson lesson={lesson} errorStatus={errorStatus} />
    <Footer />
  </>
)

export default Page

export async function getServerSideProps(context) {
  return fetchPublicLessonAsProps(context)
}