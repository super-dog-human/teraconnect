/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import AloneInLandscape from '../components/landing/aloneInLandscape'
import CopyForStudent from '../components/landing/copyForStudent'
import PickedOutLesson from '../components/landing/pickedOutLesson'
import CopyForTeacher from '../components/landing/copyForTeacher'
import { BrowserView } from 'react-device-detect'

const Page = () => (
  <>
    <Head>
      <title>TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <AloneInLandscape />
        <BrowserView>
          <CopyForStudent />
        </BrowserView>
        <PickedOutLesson />
        <CopyForTeacher />
      </div>
    </Layout>
  </>
)

const bodyStyle = css({
  width: '100%',
  height: '100%',
})

export default Page