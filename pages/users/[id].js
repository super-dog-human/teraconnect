/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../../components/layout'
import fetchUserAsProps from '../../libs/middlewares/fetchUserAsProps'
import ShowUser from '../../components/user/show/'

const Page = ({ user }) => (
  <>
    <Head>
      <title>{user.name} - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <ShowUser user={user} />
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

export async function getServerSideProps(context) {
  return await fetchUserAsProps(context)
}