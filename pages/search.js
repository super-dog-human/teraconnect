/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import Head from 'next/head'
import Layout from '../components/layout'
import algoliasearch from 'algoliasearch/lite'
import LessonSearch from '../components/lesson/search'

const Page = () => (
  <>
    <Head>
      <title>授業検索 - TERACONNECT</title>
    </Head>
    <InstantSearch searchClient={algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY)} indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}>
      <Configure hitsPerPage='18' />
      <Layout>
        <div css={backgroundStyle}>
          <div css={bodyStyle}>
            <LessonSearch />
          </div>
        </div>
      </Layout>
    </InstantSearch>
  </>
)

const backgroundStyle = css({
  width: '100%',
  minHeight: 'calc(100vh - 60px)',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const bodyStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
  height: '100%',
})

export default Page