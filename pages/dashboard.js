import React from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import requirePageAuth from '../libs/requestHandler/requirePageAuth'
import { signOut } from 'next-auth/client'

const Page = () => {
  return (
    <>
      <Head>
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <>
          <button className="light" onClick={() => signOut()}>ログアウト</button>
        </>
      </Layout>
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}