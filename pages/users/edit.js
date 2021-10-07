/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../../components/layout'
import requirePageAuth from '../../libs/middlewares/requirePageAuth'
import EditUser from '../../components/user/edit'

const Page = ({ user }) => (
  <>
    <Head>
      <title>サインアップ - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={backgroundStyle}>
        <div css={bodyStyle}>
          <EditUser user={user} />
        </div>
      </div>
    </Layout>
  </>
)

const backgroundStyle = css({
  width: '100%',
  minHeight: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const bodyStyle = css({
  maxWidth: '1280px',
  height: '100%',
  margin: 'auto',
})

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}