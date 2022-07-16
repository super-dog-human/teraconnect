/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import { connectInfiniteHits, connectSearchBox, PoweredBy } from 'react-instantsearch-dom'
import { useInView } from 'react-intersection-observer'
import Flex from '../../flex'
import PlainText from '../../plainText'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import LoadingIndicator from '../../loadingIndicator'
import LessonCard from './lessonCard'
import { useRouter } from 'next/router'
import Spacer from '../../spacer'

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
    <div css={bodyStyle}>
      <Container height='50' />
      {hits.length > 0 &&
          <>
            <Flex justifyContent='space-evenly' flexWrap='wrap' gap='30px' afterWidth={!hasMore && '330px'}>
              {hits.map(hit => <LessonCard key={hit.objectID} {...hit}/>)}
            </Flex>

            {hasMore &&
              <div ref={terminationRef}>
                <ContainerSpacer top='80' bottom='30'>
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
        <PlainText color='gray' size='15'>「{router.query.q}」に関連する授業が見つかりませんでした。</PlainText>
      }

      <ContainerSpacer top='50' bottom='0'>
        <Flex justifyContent='flex-end'>
          <PoweredBy />
        </Flex>
      </ContainerSpacer>

      <Spacer height='50' />
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  marginLeft: '20px',
  marginRight: '20px',
})

const loadingStyle = css({
  width: '100%',
  height: '100%',
  marginTop: '-50px', // トップマージンの高さをオフセット
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export default connectSearchBox(connectInfiniteHits(LessonSearch))