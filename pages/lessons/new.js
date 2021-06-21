import React from 'react'
import Head from 'next/head'
import Layout from '../../components/layout'
import LessonNewForm from '../../components/lesson/new/form'
import requirePageAuth from '../../libs/middlewares/requirePageAuth'
import { fetch } from '../../libs/fetch'
import useSessionExpireChecker from '../../libs/hooks/useTokenExpireChecker'

const Page = (props) => {
  useSessionExpireChecker()

  return (
    <>
      <Head>
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <LessonNewForm {...props} subjects={props.subjects} />
      </Layout>
    </>
  )
}

export default Page

export async function getServerSideProps(context) {
  const authProps = await requirePageAuth(context)
  const subjects = Array.from(await(fetch('/subjects'))).map((sub) => {
    return {
      value: sub.id,
      label: sub.japaneseName
    }
  })

  return { props: { ...authProps.props, subjects } }
}