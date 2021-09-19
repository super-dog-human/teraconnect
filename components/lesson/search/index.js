/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { connectInfiniteHits, connectSearchBox, PoweredBy } from 'react-instantsearch-dom'
import { useInView } from 'react-intersection-observer'
import Flex from '../../flex'
import PlainText from '../../plainText'
import Spacer from '../../spacer'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import LoadingIndicator from '../../loadingIndicator'
import LessonCard from './lessonCard'
import { useRouter } from 'next/router'

const LessonSearch = ({ isSearchStalled, hits, hasMore, refineNext }) => {
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
        {hits.length > 0 &&
          <>
            <Flex justifyContent='space-evenly' flexWrap='wrap' gap='30px'>
              {hits.map(hit => <LessonCard key={hit.objectID} {...hit}/>)}
              {[...Array(3 - hits.length % 3)].map((_, i) => <Container width='330' key={i} />)}
            </Flex>

            {hasMore &&
              <div ref={terminationRef}>
                <ContainerSpacer top='30' bottom='30'>
                  <Flex justifyContent='center'>
                    <Container width='40' height='40'>
                      <LoadingIndicator size='100' />
                    </Container>
                  </Flex>
                </ContainerSpacer>
              </div>
            }
          </>
        }

        {isSearchStalled &&
          <div css={loadingStyle}>
            <Container width='60' height='60'>
              <LoadingIndicator size='100' />
            </Container>
          </div>
        }

        {!isSearchStalled && hits.length === 0 && router.query.q &&
          <>
            <PlainText color='gray' size='15'>「{router.query.q}」に関連する授業が見つかりませんでした。</PlainText>
            <ContainerSpacer top='50' bottom='50'>
              <Flex justifyContent='flex-end'>
                <PoweredBy />
              </Flex>
            </ContainerSpacer>
          </>
        }
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
  height: 'calc(100% - 100px)',
  marginLeft: '20px',
  marginRight: '20px',
  paddingTop: '50px',
  paddingBottom: '50px',
})

const loadingStyle = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export default connectSearchBox(connectInfiniteHits(LessonSearch))