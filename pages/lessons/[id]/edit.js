import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../../components/layout'
import requirePageAuth from '../../../components/requirePageAuth'

const Page = () => {
  const [lesson, setLesson] = useState()
  useEffect(() => {
    // loadingを消して授業編集フォームを表示
    // 401ならエラーメッセージを表示
  })

  return (
    <>
      <Head>
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <div>edit lesson page.</div>
      </Layout>
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  return await requirePageAuth(context)
}