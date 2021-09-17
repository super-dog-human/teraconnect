/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import PageLink from '../../pageLink'
import PlainText from '../../plainText'
import Flex from '../../flex'
import Container from '../../container'
import Spacer from '../../spacer'
import AlignContainer from '../../alignContainer'
import NoImage from '../../noImage'

const lessonImageURL = process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL + '/lesson/'

export default function Navigator({ lesson }) {
  const [thumbnailURLs, setThumbnailURLs] = useState({})
  const [thumbnailErrors, setThumbnailErrors] = useState({})

  function handleThumbnailError(e) {
    if (e.currentTarget.src === thumbnailURLs.prev) {
      setThumbnailErrors(e => ({ ...e, prev: true }))
    } else {
      setThumbnailErrors(e => ({ ...e, next: true }))
    }
  }

  useEffect(() => {
    if (!lesson) return
    setThumbnailURLs({
      prev: lessonImageURL + lesson.prevLessonID + '/thumbnail.png',
      next: lessonImageURL + lesson.nextLessonID + '/thumbnail.png',
    })
  }, [lesson])

  return (
    <>
      {lesson && (lesson?.prevLessonID !== 0 || lesson?.nextLessonID !== 0) &&
        <div css={containerStyle}>
          {(lesson.prevLessonID !== 0) &&
            <div css={navigateItemStyle}>
              <PageLink path={'/lessons/' + lesson.prevLessonID}>
                <Flex alignItems='start'>
                  <Container width='150' height='84'>
                    {!thumbnailErrors.prev && <img src={thumbnailURLs.prev} alt={lesson.prevLessonTitle} css={thumbnailStyle} onError={handleThumbnailError} />}
                    {thumbnailErrors.prev && <NoImage textSize='13' color='var(--soft-white)' backgroundColor='gray' />}
                  </Container>
                  <Spacer width='15'/>
                  <div css={labelStyle}>
                    <PlainText size='13' lineHeight='13' color='gray'>
                      <AlignContainer verticalAlign='top'>
                        前の授業
                      </AlignContainer>
                    </PlainText>
                    <div css={lessonTitleStyle}>
                      {lesson.prevLessonTitle}
                    </div>
                  </div>
                </Flex>
              </PageLink>
            </div>
          }
          {(lesson.nextLessonID !== 0) &&
            <div css={navigateItemStyle}>
              <PageLink path={'/lessons/' + lesson.nextLessonID}>
                <Flex alignItems='start'>
                  <Container width='150' height='84'>
                    {!thumbnailErrors.next && <img src={thumbnailURLs.next} alt={lesson.nextLessonTitle} css={thumbnailStyle} onError={handleThumbnailError} />}
                    {thumbnailErrors.next && <NoImage textSize='13' color='var(--soft-white)' backgroundColor='gray' />}
                  </Container>
                  <Spacer width='15'/>
                  <div css={labelStyle}>
                    <PlainText size='13' lineHeight='13' color='gray'>
                      <AlignContainer verticalAlign='top'>
                        次の授業
                      </AlignContainer>
                    </PlainText>
                    <div css={lessonTitleStyle}>
                      {lesson.nextLessonTitle}
                    </div>
                  </div>
                </Flex>
              </PageLink>
            </div>
          }
        </div>
      }
    </>
  )
}

const containerStyle = css({
  width: '100%',
  minHeight: '140px',
  backgroundColor: '#e2e2e2',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap:   'wrap',
  gap: '20px 0px',
})

const thumbnailStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})

const labelStyle = css({
  width: '250px',
  height: '84px',
})

const lessonTitleStyle = css({
  height: '60px',
  marginTop: '5px',
  marginLeft: '5px',
  fontSize: '15px',
  color: 'gray',
  overflow: 'hidden',
})

const navigateItemStyle = css({
  margin: '20px',
})