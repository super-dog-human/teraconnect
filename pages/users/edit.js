import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import requirePageAuth from '../../libs/middlewares/requirePageAuth'
import useSessionExpireChecker from '../../../libs/hooks/useTokenExpireChecker'

const Page = () => {
  useSessionExpireChecker()

  return (
    <>
      <Head>
        <title>ユーザー編集 | TERACONNECT</title>
      </Head>
      <Layout>
        <h1>Profile</h1>
      </Layout>
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}