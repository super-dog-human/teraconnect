/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import useMobileDetector from '../../../libs/hooks/useMobileDetector'
import useNarrowScreenDetector from '../../../libs/hooks/useNarrowScreenDetector'
import useUserLessons from '../../../libs/hooks/user/useUserLessons'
import EmbedLesson from '../../lesson/embed/'
import HeaderImage from './headerImage'
import BlankIntroduction from './blankIntroduction'
import LessonLine from './lessonLine'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Flex from '../../flex'
import MultilineText from '../../multilineText'
import LoadingIndicator from '../../loadingIndicator'
import ZContainer from '../../zContainer'

export default function ShowUser({ user }) {
  const isMobile = useMobileDetector()
  const isNarrowScreen = useNarrowScreenDetector()
  const { isLoading, lessons } = useUserLessons(user.id)

  return (
    <div css={backgroundStyle}>
      <ZContainer zIndex='0' position='fixed'>
        <HeaderImage url={user.backgroundImageURL} user={user} isMobile={isMobile} />
      </ZContainer>

      <ZContainer zIndex='1'>
        <Spacer height='250' />

        <div css={bodyStyle}>
          <div css={containerStyle}>
            <ContainerSpacer left='10' right='10'>
              <Spacer height='50' />

              <Flex justifyContent='center' flexDirection={isNarrowScreen ? 'column' : 'row'} gap='20px'>
                <div css={playerStyle}>
                  {user.isPublishedIntroduction &&
                    <EmbedLesson lessonID={user.introductionID} />
                  }
                  {!user.isPublishedIntroduction &&
                    <BlankIntroduction />
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
                        <PlainText size='15' color='gray'>授業はまだありません。</PlainText>
                      </ContainerSpacer>
                    }
                  </Container>
                }
                {lessons.length > 0 &&
                  <ContainerSpacer left='10' right='10'>
                    <Flex flexDirection='column' gap='50px'>
                      {lessons.map((lesson, i) => (
                        <LessonLine key={i} isMobile={isMobile} lesson={lesson} />
                      ))}
                    </Flex>
                  </ContainerSpacer>
                }

                <Spacer height='100' />
              </div>
            </ContainerSpacer>
          </div>
        </div>
      </ZContainer>
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