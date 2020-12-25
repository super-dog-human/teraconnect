import React from 'react'
import Head from 'next/head'
import Layout from '../../../components/layout'
import { withRouter } from 'next/router'
import requirePageAuth from '../../../components/requirePageAuth'

const Page = withRouter(({ router }) => (
  <>
    <Head>
      <title>TERACONNECT</title>
    </Head>
    <Layout>
      <div>授業個別フォーラム {router.query.id}</div>
    </Layout>
  </>
))

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}