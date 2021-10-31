/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Image from 'next/image'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import PageLink from '../../pageLink'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import MultilineText from '../../multilineText'
import Aspect16To9Container from '../../aspect16To9Container'
import NoImage from '../../noImage'

const LessonLine = ({ isMobile, lesson }) => {
  const lineStyle = css({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '20px',
    width: '100%',
  })

  return (
    <PageLink path={'/lessons/' + lesson.id}>
      <div css={lineStyle}>
        <FlexItem flexBasis={!isMobile && '250px'}>
          <div css={thumbnailStyle}>
            {!!lesson.thumbnailURL && <Image src={lesson.thumbnailURL} width='1600' height='900' objectFit="contain" alt={lesson.title} />}
            {!lesson.thumbnailURL && <Aspect16To9Container>
              <div css={noImageStyle}>
                <NoImage textSize='15' color='var(--soft-white)' backgroundColor='gray' />
              </div>
            </Aspect16To9Container>}
          </div>
        </FlexItem>
        <Flex flexDirection='column'>
          <PlainText color='gray' size='18' lineHeight='18'>
            {lesson.title}
          </PlainText>
          <Spacer height='10' />
          <div>
            <PlainText color='gray' size='14' lineHeight='20'>
              <MultilineText texts={lesson.description} />
            </PlainText>
          </div>
        </Flex>
      </div>
    </PageLink>
  )
}

const thumbnailStyle = css({
  backgroundColor: 'var(--bg-gray)',
  width: '100%',
  minWidth: '250px',
  minHeight: '141px',
  fontSize: '0', // サムネイル画像下部の余白をなくす
})

const noImageStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
})

export default LessonLine