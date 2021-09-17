/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import Layout from '../components/layout'
import Container from '../components/container'
import AloneAvatar from '../components/index/aloneAvatar'
import CopyForStudent from '../components/index/copyForStudent'
import PickedOutLesson from '../components/index/pickedOutLesson'
import CopyForTeacher from '../components/index/copyForTeacher'
import ZContainer from '../components/zContainer'

const Page = () => (
  <>
    <Head>
      <title>TERACONNECT</title>
    </Head>
    <Layout>
      <div css={bodyStyle}>
        <ZContainer zIndex='0' position='fixed'>
          <AloneAvatar />
        </ZContainer>
        <ZContainer zIndex='1' position='relative'>
          <Container height='450'/>
          <CopyForStudent />
          <PickedOutLesson />
          <CopyForTeacher />
        </ZContainer>
      </div>
    </Layout>
  </>
)

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
  userSelect: 'none',
})

export default Page