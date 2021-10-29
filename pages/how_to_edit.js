/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import HowToEdit from '../components/howTo/edit'

const Page = () => (
  <>
    <Head>
      <title>授業の編集方法 - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <HowToEdit />
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