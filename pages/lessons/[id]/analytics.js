import React from 'react'
import Head from 'next/head'
import getQueryParamsAsProps from '../../../libs/middlewares/getQueryParamsAsProps'
import LayoutWithAuth from '../../../components/layoutWithAuth'
import LessonAnalytics from '../../../components/lesson/analytics'

const Page = ({ id }) =>  (
  <>
    <Head>
      <title>授業のレポート - TERACONNECT</title>
    </Head>
    <LayoutWithAuth>
      <LessonAnalytics lessonID={id} />
    </LayoutWithAuth>
  </>
)

export default Page

export function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}