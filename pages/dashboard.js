/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import Auth from '../components/auth'
import UserMyPage from '../components/user/mypage/'

const Page = () => {
  return (
    <>
      <Head>
        <title>マイページ - TERACONNECT</title>
      </Head>
      <Layout>
        <Auth>
          <div css={bodyStyle}>
            <UserMyPage />
          </div>
        </Auth>
      </Layout>
    </>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

export default Page