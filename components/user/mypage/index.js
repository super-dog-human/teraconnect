/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { signOut } from 'next-auth/client'
import PageLink from '../../../components/pageLink'
import useMobileDetector from '../../../libs/hooks/useMobileDetector'
import useCurrentUserLessons from '../../../libs/hooks/user/useCurrentUserLessons'
import UserIcon from '../../userIcon'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Icon from '../../icon'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import LoadingIndicator from '../../loadingIndicator'
import LabelButton from '../../button/labelButton'
import LessonLine from './lessonLine'

export default function UserMyPage({ user }) {
  const isMobile = useMobileDetector()
  const { isLoading, lessons } = useCurrentUserLessons()

  return (
    <div css={backgroundStyle}>
      <Spacer height={isMobile ? '50' : '100'} />

      <div css={userStyle}>
        <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent='space-between' gap={!isMobile && '50px'}>
          <FlexItem flexBasis='50%'>
            <Flex justifyContent='center'>
              <Container width='200' height='200'>
                <UserIcon id={user.id} />
              </Container>
            </Flex>
            <Spacer height='30' />
            <Flex justifyContent='center'>
              <PlainText color='gray' size='14'>
                {user.name}
              </PlainText>
            </Flex>
            <Spacer height='20' />
            <Flex justifyContent='center'>
              <PageLink path='/users/edit'>
                <Container height='22'>
                  <Flex alignItems='center'>
                    <Spacer height='22' />
                    <Container width='15' height='15'>
                      <Icon name='edit-gray' />
                    </Container>
                    <Spacer width='5' />
                    <PlainText color='var(--text-dark-gray)' size='13'>
                      プロフィール・自己紹介を編集
                    </PlainText>
                  </Flex>
                </Container>
              </PageLink>
            </Flex>
            <Spacer height='30' />
          </FlexItem>
          <FlexItem flexBasis='50%'>
            <Container height='200'>
              <Flex flexDirection='column' alignItems='strech'>
                <Flex alignItems='center'>
                  <Container width='200'>
                    <PlainText color='gray' size='13'>合計再生回数</PlainText>
                  </Container>
                  <div css={fullWidthStyle}>
                    <PlainText color='gray' size='45' fontWeight='bold'>-</PlainText>
                    <Spacer width='10' />
                    <Container width='30'>
                      <PlainText color='gray' size='13'>回</PlainText>
                    </Container>
                    <Spacer width='10' />
                  </div>
                </Flex>
                <Flex alignItems='baseline'>
                  <Container width='200'>
                    <PlainText color='gray' size='13'>完全再生率</PlainText>
                  </Container>
                  <div css={fullWidthStyle}>
                    <PlainText color='gray' size='45' fontWeight='bold'>-</PlainText>
                    <Spacer width='10' />
                    <Container width='30'>
                      <PlainText color='gray' size='13'>%</PlainText>
                    </Container>
                    <Spacer width='10' />
                  </div>
                </Flex>
                <Flex alignItems='baseline'>
                  <Container width='200'>
                    <PlainText color='gray' size='13'>推薦獲得</PlainText>
                  </Container>
                  <div css={fullWidthStyle}>
                    <PlainText color='gray' size='45' fontWeight='bold'>-</PlainText>
                    <Spacer width='10' />
                    <Container width='30'>
                      <PlainText color='gray' size='13'>推薦</PlainText>
                    </Container>
                    <Spacer width='10' />
                  </div>
                </Flex>
              </Flex>
            </Container>
          </FlexItem>
        </Flex>
      </div>

      <ContainerSpacer top='50' bottom={isMobile ? '50' : '90'}>
        <Flex justifyContent='center'>
          <Container width='110' height='30'>
            <LabelButton fontSize='16' fontWeight='bold' color='var(--error-red)' onClick={() => signOut({ callbackUrl: '/' })}>ログアウト</LabelButton>
          </Container>
        </Flex>
      </ContainerSpacer>

      {lessons.length === 0 &&
        <Container height='100'>
          {isLoading && <LoadingIndicator size='30' />}
          {!isLoading &&
            <Flex justifyContent={isMobile && 'center'}>
              {!isMobile && <Spacer width='50' />}
              <PlainText size='15' color='gray'>授業はまだありません。</PlainText>
            </Flex>
          }
        </Container>
      }

      {lessons.length > 0 &&
        <ContainerSpacer left='20' right='20'>
          {lessons.map((lesson, i) => (
            <ContainerSpacer key={i} bottom='50'>
              <LessonLine isMobile={isMobile} lesson={lesson} />
            </ContainerSpacer>
          ))}
        </ContainerSpacer>
      }

      <Spacer height='50' />
    </div>
  )
}

const backgroundStyle = css({
  maxWidth: '1280px',
  height: '100%',
  margin: 'auto',
})

const userStyle = css({
  width: '80%',
  margin: 'auto',
})

const fullWidthStyle = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'baseline',
})