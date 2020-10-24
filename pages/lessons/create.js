import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import requirePageAuth from '../../components/requirePageAuth'

const Page = () => (
  <>
    <Head>
      <title>TERACONNECT</title>
    </Head>
    <Layout>
      <div>Create lesson page.</div>
    </Layout>
  </>
)

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}

export default Page