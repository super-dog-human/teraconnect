/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Head from 'next/head'
import EmbedLesson from '../../../components/lesson/embed'
import getQueryParamsAsProps from '../../../libs/middlewares/getQueryParamsAsProps'

const Page = ({ id, view_key }) => (
  <>
    <Head>
      <title>授業の再生 - TERACONNECT</title>
    </Head>
    <div css={bodyStyle}>
      <EmbedLesson id={id} viewKey={view_key} />
    </div>
  </>
)

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

export default Page

export function getServerSideProps(context) {
  return getQueryParamsAsProps(context)
}