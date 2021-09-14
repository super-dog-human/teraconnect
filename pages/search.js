/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { InstantSearch } from 'react-instantsearch-dom'
import Head from 'next/head'
import Layout from '../components/layout'
import algoliasearch from 'algoliasearch/lite'
import LessonSearch from '../components/lesson/search'

const Page = () => (
  <>
    <Head>
      <title>授業検索 | TERACONNECT</title>
    </Head>
    <InstantSearch searchClient={algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY)}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}>
      <Layout>
        <div css={bodyStyle}>
          <LessonSearch />
        </div>
      </Layout>
    </InstantSearch>
  </>
)

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--soft-white)',
})

export default Page