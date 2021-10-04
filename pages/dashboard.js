import React from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import requirePageAuth from '../libs/middlewares/requirePageAuth'
import { signOut } from 'next-auth/client'
import PageLink from '../components/pageLink'

const Page = () => {
  return (
    <>
      <Head>
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <>
          <button onClick={() => signOut()}>ログアウト</button>
          <PageLink path='/users/edit'>編集</PageLink>
        </>
      </Layout>
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}