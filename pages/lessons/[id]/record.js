import React from 'react'
import Head from 'next/head'
import getQueryParamsAsProps from '../../../libs/middlewares/getQueryParamsAsProps'
import { LessonRecorderProvider } from '../../../libs/contexts/lessonRecorderContext'
import LayoutWithAuth from '../../../components/layoutWithAuth'
import LessonRecord from '../../../components/lesson/record/'

const Page = ({ id }) =>  (
  <>
    <Head>
      <title>授業の収録 - TERACONNECT</title>
    </Head>
    <LayoutWithAuth>
      <LessonRecorderProvider>
        <LessonRecord lessonID={id} />
      </LessonRecorderProvider>
    </LayoutWithAuth>
  </>
)

export default Page

export function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}