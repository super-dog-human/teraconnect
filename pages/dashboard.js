/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import requirePageAuth from '../libs/middlewares/requirePageAuth'
import UserMyPage from '../components/user/mypage/'

const Page = ({ user }) => {
  return (
    <>
      <Head>
        <title>マイページ - TERACONNECT</title>
      </Head>
      <Layout>
        <div css={bodyStyle}>
          <UserMyPage user={user} />
        </div>
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

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}