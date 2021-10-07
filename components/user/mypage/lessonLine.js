/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Image from 'next/image'
import PageLink from '../../pageLink'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import Icon from '../../icon'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import MultilineText from '../../multilineText'
import LessonLink from './lessonLink'
import StatusLabel from './statusLabel'

const LessonLine = ({ isMobile, lesson }) => (
  <Flex>
    <Flex flexDirection={isMobile ? 'column' : 'row'} gap='20px'>
      <FlexItem flexBasis={!isMobile && '250px'}>
        <LessonLink status={lesson.status} lessonID={lesson.id} viewKey={lesson.viewKey}>
          <Container minWidth='250' minHeight='141'>
            <div css={thumbnailStyle}>
              <Image src={lesson.thumbnailURL} width='1600' height='900' objectFit="contain" alt={lesson.title} />
            </div>
          </Container>
        </LessonLink>
      </FlexItem>
      <div>
        <LessonLink status={lesson.status} lessonID={lesson.id} viewKey={lesson.viewKey}>
          <Flex>
            <FlexItem flexBasis='70px'>
              <StatusLabel status={lesson.status} />
            </FlexItem>
            <FlexItem flexBasis='10px'>
              <Spacer width='10' />
            </FlexItem>
            <PlainText color='gray' size='17' lineHeight='28'>
              {lesson.title}
            </PlainText>
          </Flex>
          <ContainerSpacer top='10'>
            <PlainText color='gray' size='14' lineHeight='20'>
              <MultilineText texts={lesson.description} />
            </PlainText>
          </ContainerSpacer>
        </LessonLink>
      </div>
    </Flex>
    {!isMobile &&
      <>
        <FlexItem flexBasis='20px'>
          <Spacer width='20' />
        </FlexItem>
        <FlexItem flexBasis='50px'>
          <PageLink path={`/lessons/${lesson.id}/edit`}>
            <Container width='50' height='22'>
              <Flex alignItems='center'>
                <Spacer height='22' />
                <Container width='15' height='15'>
                  <Icon name='edit-gray' />
                </Container>
                <Spacer width='5' />
                <PlainText color='var(--text-dark-gray)' size='15' lineHeight='22' whiteSpace='nowrap'>
                  編集
                </PlainText>
              </Flex>
            </Container>
          </PageLink>
        </FlexItem>
      </>
    }
  </Flex>
)

const thumbnailStyle = css({
  backgroundColor: 'var(--bg-gray)',
})

export default LessonLine