import React from 'react'
import Head from 'next/head'
import Layout from '../components/layout'
import AloneInLandscape from '../components/landing/aloneInLandscape'
import CopyForStudent from '../components/landing/copyForStudent'
import PickedOutLesson from '../components/landing/pickedOutLesson'
import CopyForTeacher from '../components/landing/copyForTeacher'
import { BrowserView } from 'react-device-detect'

export default function Page() {
  return (
    <>
      <Head>
        <title>TERACONNECT</title>
      </Head>
      <Layout>
        <AloneInLandscape />
        <BrowserView>
          <CopyForStudent />
        </BrowserView>
        <PickedOutLesson />
        <CopyForTeacher />
      </Layout>
    </>
  )
}