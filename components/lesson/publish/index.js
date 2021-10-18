/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useSessionExpireChecker from '../../../libs/hooks/useTokenExpireChecker'
import useMobileDetector from '../../../libs/hooks/useMobileDetector'
import useLesson from '../../../libs/hooks/lesson/useLesson'
import useLessonMaterial from '../../../libs/hooks/lesson/useLessonMaterial'
import Header from '../../authoringHeader'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Spacer from '../../spacer'
import Flex from '../../flex'
import LoadingIndicator from '../../loadingIndicator'
import LessonPublishingForm from './form'

export default function LessonPublish({ lessonID }) {
  useSessionExpireChecker()
  const isMobile = useMobileDetector()
  const lesson = useLesson(lessonID)
  const material = useLessonMaterial(lesson)

  return (
    <>
      <Header currentPage='publish' />
      <main css={mainStyle}>
        <div css={bodyStyle}>
          <Spacer height='70' />

          {(!lesson || !material) &&
            <Flex justifyContent='center'>
              <ContainerSpacer top='100' bottom='170'>
                <Container width='60' height='60'>
                  <LoadingIndicator size='100'/>
                </Container>
              </ContainerSpacer>
            </Flex>
          }

          {!!lesson && !!material &&
            <LessonPublishingForm isMobile={isMobile} isIntroduction={lesson.isIntroduction} lesson={lesson} material={material} />
          }
        </div>
      </main>
    </>
  )
}

const mainStyle = css({
  backgroundColor: 'var(--bg-light-gray)',
  userSelect: 'none',
})

const bodyStyle = css({
  margin: 'auto',
  marginTop: '60px', // ヘッダ分をオフセット
  maxWidth: '900px',
  height: '100%',
})