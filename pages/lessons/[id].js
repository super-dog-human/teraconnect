/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../../components/layout'
import Lesson from '../../components/lesson/index'
import getQueryParamsAsProps from '../../libs/middlewares/getQueryParamsAsProps'

const Page = ({ id, view_key }) => (
  <>
    <Head>
      <title>授業の再生 - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <Lesson id={id} viewKey={view_key} />
      </div>
    </Layout>
  </>
)

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

export default Page

export function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}