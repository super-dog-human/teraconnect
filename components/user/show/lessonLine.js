/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Image from 'next/image'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import PageLink from '../../pageLink'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Container from '../../container'
import MultilineText from '../../multilineText'

const LessonLine = ({ isMobile, lesson }) => (
  <PageLink path={'/lessons/' + lesson.id}>
    <Flex flexDirection={isMobile ? 'column' : 'row'} gap='20px'>
      <FlexItem flexBasis={!isMobile && '250px'}>
        <Container minWidth='250' minHeight='141'>
          <div css={thumbnailStyle}>
            <Image src={lesson.thumbnailURL} width='1600' height='900' objectFit="contain" alt={lesson.title} />
          </div>
        </Container>
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
    </Flex>
  </PageLink>
)

const thumbnailStyle = css({
  backgroundColor: 'var(--bg-gray)',
})

export default LessonLine