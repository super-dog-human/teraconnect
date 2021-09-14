/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { connectInfiniteHits, PoweredBy } from 'react-instantsearch-dom'
import Flex from '../../flex'
import PlainText from '../../plainText'
import Spacer from '../../spacer'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import LessonCard from './lessonCard'

const LessonSearch = ({ hits, hasMore, refineNext }) => (
  <div css={backgroundStyle}>
    <div css={bodyStyle}>
      <Spacer height='20' />
      <Flex justifyContent='space-evenly' flexWrap='wrap' gap='30px'>
        {hits.map(hit => <LessonCard key={hit.objectID} {...hit}/>)}
        {[...Array(3 - hits.length % 3)].map((_, i) => <Container width='370' key={i} />)}
      </Flex>

      {hits.length === 0 && <>
        <PlainText color='gray' size='15'>授業が見つかりませんでした。</PlainText>
      </>}

      {hasMore &&
        <button onClick={refineNext}>
          Show more
        </button>
      }

      <ContainerSpacer top='50' bottom='50'>
        <Flex justifyContent='right'>
          <PoweredBy />
        </Flex>
      </ContainerSpacer>
    </div>
  </div>
)

const backgroundStyle = css({
  margin: 'auto',
  maxWidth: '1280px',
  height: '100%',
})

const bodyStyle = css({
  marginLeft: '20px',
  marginRight: '20px',
})

export default connectInfiniteHits(LessonSearch)