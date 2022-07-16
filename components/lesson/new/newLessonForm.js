/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Spacer from '../../spacer'
import Flex from '../../flex'
import PlainText from '../../plainText'
import Select from '../../form/select'
import InputText from '../../form/inputText'
import InputHidden from '../../form/inputHidden'
import LabelButton from '../../button/labelButton'
import LoadingIndicator from '../../loadingIndicator'

export default function NewLessonForm({ user, subjects, categories, subjectDisabled, categoryDisabled, handleSubjectChange, isCreating, needsRecordingProps,
  subjectIDSelectProps, titleInputProps, categoryIDSelectProps, handleBackButtonClick, handleCategoryIDSelectChange, handleTitleInputChange, formErrors, handleSubmit, onSubmit }) {

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Spacer height='50' />
      <InputHidden {...needsRecordingProps} />
      <Flex justifyContent='center'>
        <div css={formStyle}>
          <Flex gap='30px'>
            <div css={selectorStyle}>
              <Select color='gray' size='17' topLabel='教科を選択' topValue='' options={subjects} disabled={subjectDisabled} onChange={handleSubjectChange} {...subjectIDSelectProps} />
            </div>
            <div css={selectorStyle}>
              <Select color='gray' size='17' topLabel='単元を選択' topValue='' options={categories} disabled={categoryDisabled} onChange={handleCategoryIDSelectChange} {...categoryIDSelectProps} />
            </div>
          </Flex>
          <Spacer height='30' />
          <Container height='25'>
            <InputText color='gray' size='17' borderWidth='0 0 1px 0' borderColor='var(--text-gray)' placeholder='授業タイトルを入力' maxLength="100" onChange={handleTitleInputChange} {...titleInputProps} />
          </Container>
        </div>
      </Flex>

      <Spacer height='20' />

      <Flex justifyContent='center'>
        <Container height='24'>
          {formErrors &&
            <PlainText size='13' color='var(--error-red)'>
              {(() => {
                if (formErrors.subjectID) {
                  return '教科を選択してください。'
                } else if (formErrors.japaneseCategoryID) {
                  return '単元を選択してください。'
                } else if (formErrors.title) {
                  return 'タイトルを入力してください。'
                }
              })()}
            </PlainText>
          }
        </Container>
      </Flex>

      <ContainerSpacer top='30' bottom='80'>
        <Flex justifyContent='center' gap='50px'>
          <Container width='120' height='40'>
            <LabelButton color='var(--dark-purple)' borderColor='var(--dark-purple)' type='button' onClick={handleBackButtonClick}>もどる</LabelButton>
          </Container>
          <Container width='120' height='40'>
            <LabelButton color='white' backgroundColor='var(--dark-purple)' type='submit' disabled={!user || isCreating}>
              {!isCreating && '作成'}
              {isCreating && <LoadingIndicator size='20' color='white' />}
            </LabelButton>
          </Container>
        </Flex>
      </ContainerSpacer>
    </form>
  )
}

const formStyle = css({
  width: '100%',
  maxWidth: '580px',
  marginLeft: '10px',
  marginRight: '10px',
})

const selectorStyle = css({
  width: '100%',
  height: '25px',

})