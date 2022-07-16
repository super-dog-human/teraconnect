/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/react'
import PageLink from '../../pageLink'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import Container from '../../container'
import Spacer from '../../spacer'
import NoImage from '../../noImage'
import PlainText from '../../plainText'
import UserIcon from '../../userIcon'

const lessonImageURL = process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL + '/lesson/'

export default function LessonCard({ id, userID, title, description }) {
  const [isThumbnailError, setIsThumbnailError] = useState(false)
  function handleThumbnailError() {
    setIsThumbnailError(true)
  }

  return (
    <div css={containerStyle}>
      <Container width='300' height='320'>
        <PageLink path={'/lessons/' + id}>
          <Container width='300' height='169'>
            {!isThumbnailError && <img src={lessonImageURL + id + '/thumbnail.png'} alt={title} css={thumbnailStyle} onError={handleThumbnailError} />}
            {isThumbnailError && <NoImage color='var(--soft-white)' backgroundColor='gray' />}
          </Container>
        </PageLink>
        <Spacer height='5' />
        <Flex alignItems='center'>
          <FlexItem flexBasis='36px'>
            <PageLink path={'/users/' + userID}>
              <Container widht='36' height='36'>
                <UserIcon id={userID} />
              </Container>
            </PageLink>
          </FlexItem>
          <Spacer width='10' />
          <PageLink path={'/lessons/' + id}>
            <Container width='254'>
              <div css={titleStyle}>
                <PlainText color='gray' size='17' lineHeight='17'>{title}</PlainText>
              </div>
            </Container>
          </PageLink>
        </Flex>
        <Spacer height='5' />
        <PageLink path={'/lessons/' + id}>
          <div css={descriptionStyle}>
            <PlainText color='gray' size='13'>{description}</PlainText>
          </div>
        </PageLink>
      </Container>
    </div>
  )
}

const containerStyle = css({
  backgroundColor: 'white',
  padding: '15px',
  '.ais-Highlight-highlighted': {
    backgroundColor: '#ffc168',
  }
})

const thumbnailStyle = css({
  width: '300px',
  height: '169px',
  objectFit: 'contain',
})

const titleStyle = css({
  maxHeight: '50px',
  overflow: 'hidden',
})

const descriptionStyle = css({
  height: '100px',
  overflow: 'hidden',
})