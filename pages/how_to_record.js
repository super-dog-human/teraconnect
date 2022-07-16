/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Head from 'next/head'
import Layout from '../components/layout'
import HowToRecord from '../components/howTo/record'

const Page = () => (
  <>
    <Head>
      <title>授業の収録方法 - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <HowToRecord />
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