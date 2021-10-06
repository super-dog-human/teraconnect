/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Spacer from '../spacer'
import PlainText from '../plainText'
import Container from '../container'
import ContainerSpacer from '../containerSpacer'
import AbsoluteContainer from '../absoluteContainer'
import FlashContainer from '../flashContainer'
import Flex from '../flex'
import FlexItem from '../flexItem'
import InputFile from '../form/inputFile'
import InputText from '../form/inputText'
import InputEmail from '../form/inputEmail'
import Textarea from '../form/textarea'
import IconButton from '../button/iconButton'
import LabelButton from '../button/labelButton'
import LoadingIndicator from '../loadingIndicator'
import FallbackImage from '../fallbackImage'
import useUserEditor from '../../libs/hooks/user/useUserEditor'
import { SUPPORTED_IMAGE_FILES } from '../../libs/constants'
import PageLink from '../pageLink'

export default function EditUser({ user }) {
  const { initialLoading, isNewUser, isUpdating, isUpdated, introductionID, account, inputFileRef, handleNameChange, handleEmailChange, handleProfileChange, handleThumbnailChange, handleThumbnailUploadingClick, handleSubmit, handleSubmitClick,
    nameInputProps, emailInputProps, profileInputProps, formErrors } = useUserEditor(user)

  return (
    <div css={bodyStyle}>
      {initialLoading && <div css={loadingStyle}>
        <Container width='50' height='50'>
          <LoadingIndicator size='100' />
        </Container>
      </div>}

      {!initialLoading && <>
        <Spacer height='40' />

        <ContainerSpacer left='20' right='20'>

          <Flex justifyContent='center' flexWrap='wrap'>
            <Container width='150' position='relative'>
              <div css={iconStyle}>
                <FallbackImage url={account.thumbnailURL} name={account.name} />
              </div>
              <AbsoluteContainer right='0' bottom='0'>
                <Container width='25'>
                  <InputFile accept={SUPPORTED_IMAGE_FILES} onChange={handleThumbnailChange} ref={inputFileRef} />
                  <IconButton name='photo-upload-gray' onClick={handleThumbnailUploadingClick} />
                </Container>
              </AbsoluteContainer>
            </Container>
          </Flex>

          <Spacer height='50' />

          <Flex justifyContent='center'>
            <FlexItem flexBasis='100%'>
              <Container height='25'>
                <InputText size='20' color='gray' borderWidth='0px 0px 1px 0px' placeholder='名前を入力' onChange={handleNameChange} {...nameInputProps } />
              </Container>
              <Spacer height='30' />
              <Container height='25'>
                <InputEmail size='20' color='gray' borderWidth='0px 0px 1px 0px' placeholder='メールアドレスを入力' onChange={handleEmailChange} {...emailInputProps } />
              </Container>
              <Spacer height='40' />
              <Container height='130'>
                <Textarea size='16' color='gray' borderColor='gray' borderWidth='1px' padding='10' placeholder='プロフィールを入力' maxLength='500' onChange={handleProfileChange} {...profileInputProps} />
              </Container>
              <Spacer height='20' />
              {introductionID === 0 &&
                <PageLink path='/lessons/new?is_introduction=true'>
                  <PlainText color='gray' size='15'>自己紹介の作成</PlainText>
                </PageLink>
              }
              {introductionID > 0 &&
                <PageLink path={`/lessons/${introductionID}/edit`}>
                  <PlainText color='gray' size='15'>自己紹介の編集</PlainText>
                </PageLink>
              }
              <Container height='60'>
                {formErrors && <div><PlainText size='13' color='var(--error-red)'>
                  {(() => {
                    if (formErrors.name?.type === 'required') {
                      return 'ユーザー名を入力してください。'
                    } else if (formErrors.email?.type === 'required') {
                      return 'メールアドレスを入力してください。'
                    } else if (formErrors.email?.type === 'pattern') {
                      return 'メールアドレスの書式が正しくありません。'
                    }
                  })()}
                </PlainText></div>
                }
              </Container>
            </FlexItem>
          </Flex>

          <Spacer height='20' />

          <Flex justifyContent='center'>
            <Container width='120' height='40'>
              <LabelButton color='white' fontSize='15' backgroundColor='var(--dark-purple)' onClick={handleSubmit(handleSubmitClick)}>
                {!isUpdating && isNewUser && '登録'}
                {!isUpdating && !isNewUser && '更新'}
                {isUpdating && <LoadingIndicator size='20' color='white' />}
              </LabelButton>
            </Container>
          </Flex>

          <Spacer height='20' />

          <Flex justifyContent='center'>
            <Container height='30'>
              <FlashContainer isShow={isUpdated} timeoutMs='2000' transitionDuration='200' >
                <PlainText size='12' fontWeight='500' color='var(--dark-purple)'>ユーザー登録を{isNewUser ? '完了' : '更新'}しました。</PlainText>
              </FlashContainer>
            </Container>
          </Flex>
        </ContainerSpacer>
      </>
      }
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  maxWidth: '600px',
  height: '100%',
  margin: 'auto',
})

const loadingStyle = css({
  width: '100%',
  height: 'calc(100vh - 60px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const iconStyle = css({
  width: '100px',
  height: '100px',
  margin: 'auto',
  borderRadius: '50%',
  overflow: 'hidden',
  userSelect: 'none',
})