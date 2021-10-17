/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import TermsOfUse from '../components/termsOfUse'

const Page = () => (
  <>
    <Head>
      <title>利用規約 - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <TermsOfUse />
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