import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import Lesson from '../../components/lesson/index'
import getQueryParamsAsProps from '../../libs/middlewares/getQueryParamsAsProps'

const Page = ({ id, viewKey }) => (
  <>
    <Head>
      <title>授業の再生 - TERACONNECT</title>
    </Head>
    <Layout>
      <Lesson id={id} viewKey={viewKey} />
    </Layout>
  </>
)

export default Page

export async function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}