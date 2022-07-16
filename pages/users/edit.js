/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Head from 'next/head'
import Layout from '../../components/layout'
import Auth from '../../components/auth'
import EditUser from '../../components/user/edit'
import getSessionUserAsProps from '../../libs/middlewares/getSessionUserAsProps'

const Page = ({ user }) => (
  <>
    <Head>
      <title>ユーザー登録 - TERACONNECT</title>
    </Head>
    <Layout>
      <Auth>
        <div css={backgroundStyle}>
          <div css={bodyStyle}>
            <EditUser user={user} />
          </div>
        </div>
      </Auth>
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
  return await getSessionUserAsProps(context)
}