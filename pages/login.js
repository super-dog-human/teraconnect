import React from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import { signIn } from 'next-auth/client'

export default function Page() {
  return (
    <>
      <Head>
        <title>ログイン - TERACONNECT</title>
      </Head>
      <Layout>
        <div>
          <div>
            <button onClick={() => signIn('google')}>Google</button>
          </div>
          <div>
            <button onClick={() => signIn('twitter')}>twitter</button>
          </div>
        </div>
      </Layout>
    </>
  )
}