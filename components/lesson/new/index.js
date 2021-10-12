import React from 'react'
import { useRouter } from 'next/router'
import useCreatingLesson from '../../../libs/hooks/lesson/new/useCreatingLesson'
import useSubjectsAndCategories from '../../../libs/hooks/lesson/useSubjectsAndCategories'
import useSessionExpireChecker from '../../../libs/hooks/useTokenExpireChecker'
import TransitionContainer from '../../transition/transitionContainer'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import LoadingIndicator from '../../loadingIndicator'
import Flex from '../../flex'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import ModeSelector from './modeSelector'
import NewLessonForm from './newLessonForm'

export default function NewLesson() {
  const router = useRouter()
  const isIntroduction = router.query.is_introduction === 'true'
  const { isSelectedMethod, setValue, handleModeButtonClick, handleSubjectIDSelectChange, ...props } = useCreatingLesson({ isIntroduction })
  const subjectProps = useSubjectsAndCategories({ setValue, handleSubjectIDSelectChange })
  useSessionExpireChecker()

  return (
    <>
      {router.query.is_introduction === 'true' &&
        <>
          <Spacer height='50' />
          <ContainerSpacer left='60'>
            <PlainText size='20' color='var(--text-gray)'>せっかくなので、自己紹介をしましょう。</PlainText>
          </ContainerSpacer>
        </>
      }

      <Spacer height='50' />
      {!isSelectedMethod && <ModeSelector isIntroduction={isIntroduction} onClick={handleModeButtonClick} />}
      {!isIntroduction && isSelectedMethod && <TransitionContainer isShow={isSelectedMethod} duration={100}>
        <NewLessonForm {...subjectProps} {...props} />
      </TransitionContainer>}
      {isIntroduction && props.isCreating &&
        <Flex justifyContent='center'>
          <Container width='350' height='350'>
            <LoadingIndicator size='10'/>
          </Container>
        </Flex>}
      <Spacer height='50' />
    </>
  )
}