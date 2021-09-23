/** @jsxImportSource @emotion/react */
import React from 'react'
import { useRouter } from 'next/router'
import { css } from '@emotion/core'
import useLessonsByCategory from '../../../libs/hooks/lesson/useLessonsByCategory'
import useTouchDeviceDetector from '../../../libs/hooks/useTouchDeviceDetector'
import Flex from '../../flex'
import PlainText from '../../plainText'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import LoadingIndicator from '../../loadingIndicator'
import PageLink from '../../pageLink'
import LessonCard from './lessonCard'
import Spacer from '../../spacer'
import Hr from '../../hr'

export default function LessonCategory() {
  const router = useRouter()
  const isTouchDevice = useTouchDeviceDetector()
  const { isLoading, hasMore, terminationRef, lessons, category } = useLessonsByCategory({ subjectID: router.query.subject_id, categoryID: router.query.category_id })

  return (
    <div css={bodyStyle}>
      <Container height='30' />
      <Container height='70'>
        {category &&
            <Flex alignItems='center'>
              <PageLink path={'/categories?subject_id=' + category.subjectID}>
                <PlainText color='gray' size='22' whiteSpace='nowrap'>
                  {category.subjectName}
                </PlainText>
              </PageLink>
              <Spacer width='30' />
              <PlainText color='gray' size='18'>
                {category.groupName}・{category.name}
              </PlainText>
            </Flex>
        }
      </Container>

      {isLoading && lessons.length === 0 &&
        <div css={loadingStyle}>
          <Container width='60' height='60'>
            <LoadingIndicator size='100' />
          </Container>
        </div>
      }

      {lessons.length > 0 &&
        <>
          <Flex justifyContent='space-evenly' flexWrap='wrap' gap='30px' afterWidth={!hasMore && '330px'}>
            {lessons.map(lesson => <LessonCard key={lesson.id} {...lesson}/>)}
          </Flex>

          {hasMore &&
            <ContainerSpacer top={isTouchDevice ? 50 : 80} bottom={isTouchDevice ? 0 : 30}>
              <Flex justifyContent='center'>
                <Container width='40' height='40'>
                  {!isLoading && <div ref={terminationRef}><LoadingIndicator size='100' /></div>}
                  {isLoading && <LoadingIndicator size='100' />}
                </Container>
              </Flex>
            </ContainerSpacer>
          }
          {!hasMore &&
            <ContainerSpacer top={isTouchDevice ? 40 : 100} bottom={(isTouchDevice ? 20 : 50) - 1}>
              <Hr width='calc(100% - 20px)' color='var(--border-gray)' />
            </ContainerSpacer>
          }
        </>
      }

      {!isLoading && lessons.length === 0 &&
        <PlainText color='gray' size='15'>この単元の授業はまだありません。</PlainText>
      }
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
  marginTop: '-100px', // トップマージンと教科・単元バーの高さをオフセット
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})