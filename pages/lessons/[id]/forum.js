import React from 'react'
import Head from 'next/head'
import Layout from '../../../components/layout'
import { withRouter } from 'next/router'

const Forum = withRouter(({ router }) => (
  <>
    <Head>
      <title>TERACONNECT</title>
    </Head>
    <Layout>
      <div>授業個別フォーラム {router.query.id}</div>
    </Layout>
  </>
))

export default Forum
