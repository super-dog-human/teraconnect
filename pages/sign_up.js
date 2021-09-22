import React from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import SignUpForm from '../components/signUp/signUpForm'

export default function Page() {
  return (
    <>
      <Head>
        <title>ユーザー登録 - TERACONNECT</title>
      </Head>
      <Layout>
        <SignUpForm />
      </Layout>
    </>
  )
}