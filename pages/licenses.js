/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import Licenses from '../components/licenses'

const Page = () => (
  <>
    <Head>
      <title>利用規約 - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <Licenses />
      </div>
    </Layout>
  </>
)

export default Page

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})