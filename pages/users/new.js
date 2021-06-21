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
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <div>new user page.</div>
      </Layout>
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  //  fetchWithAuth('/users/me')
  // 404でなければeditへ遷移
  return await requirePageAuth(context)
}