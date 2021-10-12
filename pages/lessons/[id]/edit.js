import React from 'react'
import Head from 'next/head'
import getQueryParamsAsProps from '../../../libs/middlewares/getQueryParamsAsProps'
import { ContextMenuProvider } from '../../../libs/contexts/contextMenuContext'
import { LessonEditorProvider } from '../../../libs/contexts/lessonEditorContext'
import LayoutWithAuth from '../../../components/layoutWithAuth'
import LessonEdit from '../../../components/lesson/edit/'

const Page = ({ id }) => (
  <>
    <Head>
      <title>授業の編集 - TERACONNECT</title>
    </Head>
    <LayoutWithAuth>
      <ContextMenuProvider>
        <LessonEditorProvider>
          <LessonEdit lessonID={id} />
        </LessonEditorProvider>
      </ContextMenuProvider>
    </LayoutWithAuth>
  </>
)

export default Page

export function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}