/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Head from 'next/head'
import Layout from '../../components/layout'
import Auth from '../../components/auth'
import NewLesson from '../../components/lesson/new/'

const Page = () => (
  <>
    <Head>
      <title>授業の作成 - TERACONNECT</title>
    </Head>
    <Layout>
      <Auth>
        <div css={backgroundStyle}>
          <div css={bodyStyle}>
            <NewLesson />
          </div>
        </div>
      </Auth>
    </Layout>
  </>
)

const backgroundStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const bodyStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
  height: '100%',
})

export default Page