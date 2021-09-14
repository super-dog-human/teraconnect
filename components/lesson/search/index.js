/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { connectInfiniteHits, PoweredBy } from 'react-instantsearch-dom'
import { useInView } from 'react-intersection-observer'
import Flex from '../../flex'
import PlainText from '../../plainText'
import Spacer from '../../spacer'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import LoadingIndicator from '../../loadingIndicator'
import LessonCard from './lessonCard'
import { useRouter } from 'next/router'

const LessonSearch = ({ hits, hasMore, refineNext }) => {
  const { ref: terminationRef, inView } = useInView()
  const [shouldFetchNext, setShouldFetchNext] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!inView || !hasMore) return
    setShouldFetchNext(true)
  }, [inView, hasMore])

  useEffect(() => {
    if (!shouldFetchNext) return
    refineNext()
    setShouldFetchNext(false)
  }, [shouldFetchNext, refineNext])

  return (
    <div css={backgroundStyle}>
      <div css={bodyStyle}>
        <Spacer height='50' />

        <Flex justifyContent='space-evenly' flexWrap='wrap' gap='30px'>
          {hits.map(hit => <LessonCard key={hit.objectID} {...hit}/>)}
          {[...Array(3 - hits.length % 3)].map((_, i) => <Container width='370' key={i} />)}
        </Flex>

        {hits.length > 0 && hasMore &&
          <div ref={terminationRef}>
            <Spacer height='100' />
            <Flex justifyContent='center'>
              <Container width='40' height='40'>
                <LoadingIndicator />
              </Container>
            </Flex>
          </div>
        }

        {hits.length === 0 && router.query.q &&
          <PlainText color='gray' size='15'>「{router.query.q}」に関連する授業が見つかりませんでした。</PlainText>
        }

        <ContainerSpacer top='50' bottom='50'>
          <Flex justifyContent='right'>
            <PoweredBy />
          </Flex>
        </ContainerSpacer>
      </div>
    </div>
  )
}

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