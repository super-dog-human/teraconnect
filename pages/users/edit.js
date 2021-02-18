import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import requirePageAuth from '../../libs/requirePageAuth'

const Page = () => (
  <>
    <Head>
      <title>ユーザー編集 | TERACONNECT</title>
    </Head>
    <Layout>
      <h1>Profile</h1>
    </Layout>
  </>
)

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}