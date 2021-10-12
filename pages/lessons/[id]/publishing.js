import React from 'react'
import Head from 'next/head'
import getQueryParamsAsProps from '../../../libs/middlewares/getQueryParamsAsProps'
import { ContextMenuProvider } from '../../../libs/contexts/contextMenuContext'
import LayoutWithAuth from '../../../components/layoutWithAuth'
import LessonPublishing from '../../../components/lesson/publishing'

const Page = ({ id }) => (
  <>
    <Head>
      <title>授業の公開設定 - TERACONNECT</title>
    </Head>
    <LayoutWithAuth>
      <ContextMenuProvider>
        <LessonPublishing lessonID={id} />
      </ContextMenuProvider>
    </LayoutWithAuth>
  </>
)

export default Page

export function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}