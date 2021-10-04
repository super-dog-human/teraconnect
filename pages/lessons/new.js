/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../../components/layout'
import NewLesson from '../../components/lesson/new/'
import requirePageAuth from '../../libs/middlewares/requirePageAuth'
import useSessionExpireChecker from '../../libs/hooks/useTokenExpireChecker'

const Page = (props) => {
  useSessionExpireChecker()

  return (
    <>
      <Head>
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <div css={backgroundStyle}>
          <div css={bodyStyle}>
            <NewLesson user={props.user} />
          </div>
        </div>
      </Layout>
    </>
  )
}

const backgroundStyle = css({
  width: '100%',
  minHeight: 'calc(100vh - 60px)',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const bodyStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
  height: '100%',
})

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}