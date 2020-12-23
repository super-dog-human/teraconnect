import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import LessonNewForm from '../../components/lesson/new/form'
import requirePageAuth from '../../components/requirePageAuth'
import fetch from '../../libs/fetch'

const Page = (props) => (
  <>
    <Head>
      <title>TERACONNECT</title>
    </Head>
    <Layout>
      <LessonNewForm subjects={ props.subjects } />
    </Layout>
  </>
)

export default Page

export async function getServerSideProps(context) {
  const subjects = Array.from(await(fetch('/subjects'))).map((sub) => {
    return {
      value: sub.id,
      label: sub.japaneseName
    }
  })

  const authProps = await requirePageAuth(context)
  return { props: { authProps, subjects } }
}