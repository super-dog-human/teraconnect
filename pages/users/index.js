/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../../components/layout'
import Users from '../../components/users/'

const Page = () => (
  <>
    <Head>
      <title>人で探す - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <Users />
      </div>
    </Layout>
  </>
)

const bodyStyle = css({
  width: '100%',
  minHeight: 'calc(100vh - 60px)',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

export default Page