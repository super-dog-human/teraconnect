/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import getQueryParamsAsProps from '../libs/middlewares/getQueryParamsAsProps'
import Head from 'next/head'
import Layout from '../components/layout'
import About from '../components/about'

const Page = ({ show_navigate }) => (
  <>
    <Head>
      <title>TERACONNECTとは - TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <About isShowNavigate={show_navigate === 'true'} />
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

export function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}