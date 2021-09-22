/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../../components/layout'
import LessonCategory from '../../components/lesson/category'

const Page = () => (
  <>
    <Head>
      <title>教科・単元 | TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <LessonCategory />
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