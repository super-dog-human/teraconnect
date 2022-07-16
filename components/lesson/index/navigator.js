/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import NavigatorItem from './navigatorItem'

const lessonImageURL = process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL + '/lesson/'

export default function Navigator({ isMobile, lesson }) {
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
          {lesson.prevLessonID !== 0 &&
            <NavigatorItem isMobile={isMobile} isNext={false} lessonID={lesson.prevLessonID} otherLessonID={lesson.nextLessonID} title={lesson.prevLessonTitle}
              thumbnailURL={thumbnailURLs.prev} thumbnailError={thumbnailErrors.prev} onThumbnailError={handleThumbnailError} />
          }
          {lesson.nextLessonID !== 0 &&
            <NavigatorItem isMobile={isMobile} isNext={true} lessonID={lesson.nextLessonID} otherLessonID={lesson.prevLessonID} title={lesson.nextLessonTitle}
              thumbnailURL={thumbnailURLs.next} thumbnailError={thumbnailErrors.next} onThumbnailError={handleThumbnailError} />
          }
        </div>
      }
    </>
  )
}

const containerStyle = css({
  width: '100%',
  minHeight: '140px',
  backgroundColor: 'var(--bg-gray)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap:   'wrap',
  gap: '20px 40px',
})