/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { Highlight } from 'react-instantsearch-dom'
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

export default function LessonCard(hit) {
  const [isThumbnailError, setIsThumbnailError] = useState(false)
  const [bodyHit, setBodyHit] = useState({})

  function handleThumbnailError() {
    setIsThumbnailError(true)
  }

  useEffect(() => {
    if (hit._highlightResult.body.matchedWords.length === 0) {
      setBodyHit(hit)
    } else {
      const matchedIndex = hit._highlightResult.body.value.indexOf('<ais-highlight-0000000000>')
      hit._highlightResult.body.value = hit._highlightResult.body.value.slice(matchedIndex)
      setBodyHit(hit)
    }
  }, [hit])

  return (
    <div css={containerStyle}>
      <Container width='300' height='410'>
        <PageLink path={`/lessons?subject_id=${hit.subjectID}&category_id=${hit.categoryID}`}>
            <Flex>
              <PlainText color='gray' size='13'>
                <Highlight hit={hit} attribute='subjectName' />
              </PlainText>
              <Spacer width='10' />
              <PlainText color='gray' size='13'>
                <Highlight hit={hit} attribute='categoryName'/>
              </PlainText>
            </Flex>
        </PageLink>
        <Spacer height='10' />
        <PageLink path={'/lessons/' + hit.objectID}>
          <Container width='300' height='169'>
            {!isThumbnailError && <img src={lessonImageURL + hit.objectID + '/thumbnail.png'} alt={hit.title} css={thumbnailStyle} onError={handleThumbnailError} />}
            {isThumbnailError && <NoImage color='var(--soft-white)' backgroundColor='gray' />}
          </Container>
        </PageLink>
        <Spacer height='5' />
        <PageLink path={'/lessons/' + hit.objectID}>
            <div css={omitOverflowStyle}>
              <PlainText color='gray' size='17'><Highlight hit={hit} attribute='title'/></PlainText>
            </div>
            <Spacer height='5' />
            <Container height='100'>
              <div css={hideOverflowStyle}>
                <PlainText color='gray' size='13'><Highlight hit={hit} attribute='description'/></PlainText>
              </div>
            </Container>
        </PageLink>
        <Spacer height='20' />
        <div>
          <Flex>
            <FlexItem column='3' flexBasis='36px'>
              <PageLink path={'/users/' + hit.userID}>
                  <Container widht='36' height='36'>
                    <UserIcon id={hit.userID} />
                  </Container>
              </PageLink>
            </FlexItem>
            <FlexItem column='3' flexBasis='10px' />
            <FlexItem column='3'>
              <PageLink path={'/users/' + hit.userID}>
                  <div css={userNameStyle}>
                    <PlainText color='gray' size='12'><Highlight hit={hit} attribute='userName'/></PlainText><br />
                  </div>
              </PageLink>
              <Spacer height='5' />
              <div css={clippingTextStyle}>
                <PlainText color='gray'   size='13'><Highlight hit={bodyHit} attribute='body'/></PlainText>
              </div>
            </FlexItem>
          </Flex>
        </div>
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

const omitOverflowStyle = css({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const hideOverflowStyle = css({
  height: '100px',
  overflow: 'hidden',
})

const userNameStyle = css({
  width: `${300 - 36 - 10}px`,
  lineHeight: '12px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const clippingTextStyle = css({
  width: `${300 - 36 - 10}px`,
  lineHeight: '13px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})