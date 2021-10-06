/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useCurrentUser from '../../../libs/hooks/user/useCurrentUser'
import useMobileDetector from '../../../libs/hooks/useMobileDetector'
import useNarrowScreenDetector from '../../../libs/hooks/useNarrowScreenDetector'
import useUserLessons from '../../../libs/hooks/user/useUserLessons'
import EmbedLesson from '../../lesson/embed/'
import HeaderImage from './headerImage'
import EditLink from './editLink'
import BlankIntroduction from './blankIntroduction'
import LessonLine from './lessonLine'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Flex from '../../flex'
import MultilineText from '../../multilineText'
import LoadingIndicator from '../../loadingIndicator'

export default function ShowUser({ user }) {
  const currentUser = useCurrentUser()
  const isMobile = useMobileDetector()
  const isNarrowScreen = useNarrowScreenDetector()
  const { isLoading, lessons } = useUserLessons({ userID: user.id, currentUser })

  return (
    <div css={backgroundStyle}>
      <HeaderImage url={user.backgroundImageURL} user={user} zIndex='0'/>

      <Spacer height='250' />

      <div css={bodyStyle}>
        <div css={containerStyle}>
          <ContainerSpacer left='10' right='10'>
            <Container height='50'>
              <Flex justifyContent='right' alignItems='center'>
                <Spacer height='50' />
                {user.id === currentUser?.id && <EditLink />}
              </Flex>
            </Container>

            <Flex justifyContent='center' flexDirection={isNarrowScreen ? 'column' : 'row'} gap='20px'>
              <div css={playerStyle}>
                {user.isPublishedIntroduction &&
                  <EmbedLesson lessonID={user.introductionID} />
                }
                {!user.isPublishedIntroduction &&
                  <BlankIntroduction isMobile={isMobile} user={user} currentUser={currentUser} />
                }
              </div>
              <div css={profileStyle}>
                <PlainText color='gray' size='16'>
                  <MultilineText texts={user.profile} />
                </PlainText>
              </div>
            </Flex>

            <Spacer height='60' />

            <div>
              <ContainerSpacer left='10'>
                <PlainText size='22' color='gray'>
                  {user.name}の授業
                </PlainText>
              </ContainerSpacer>
              <Spacer height='30' />
              {lessons.length === 0 &&
                <Container height='100'>
                  {isLoading && <LoadingIndicator size='30' />}
                  {!isLoading &&
                    <ContainerSpacer left='20'>
                      <PlainText size='15' color='gray'>授業はありません。</PlainText>
                    </ContainerSpacer>
                  }
                </Container>
              }
              {lessons.length > 0 &&
                <ContainerSpacer left='10' right='10'>
                  <Flex flexDirection='column' gap='50px'>
                    {lessons.map((lesson, i) => (
                      <ContainerSpacer key={i} bottom={isMobile && '30'}>
                        <LessonLine isMobile={isMobile} lesson={lesson} />
                      </ContainerSpacer>
                    ))}
                  </Flex>
                </ContainerSpacer>
              }

              <Spacer height='100' />
            </div>
          </ContainerSpacer>
        </div>
      </div>
    </div>
  )
}

const backgroundStyle = css({
  width: '100%',
  height: '100%',
  margin: 'auto',
})

const bodyStyle = css({
  backgroundColor: 'var(--bg-light-gray)',
  position: 'relative',
  zIndex: 1,
})

const containerStyle = css({
  maxWidth: '1280px',
  margin: 'auto',
})

const playerStyle = css({
  width: '100%',
  flexBasis: '60%',
  margin: 'auto',
})

const profileStyle = css({
  width: 'calc(100% - 40px)',
  backgroundColor: 'var(--bg-gray)',
  padding: '20px',
  borderRadius: '5px',
  flexBasis: '40%',
})