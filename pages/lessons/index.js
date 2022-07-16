/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Head from 'next/head'
import Layout from '../../components/layout'
import LessonCategory from '../../components/lesson/category'

const Page = () => (
  <>
    <Head>
      <title>教科・単元 - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={backgroundStyle}>
        <div css={bodyStyle}>
          <LessonCategory />
        </div>
      </div>
    </Layout>
  </>
)

const backgroundStyle = css({
  width: '100%',
  minHeight: 'calc(100vh - 60px)',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const bodyStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
  height: '100%',
})

export default Page