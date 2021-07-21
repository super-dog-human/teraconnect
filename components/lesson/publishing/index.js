/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'
import { useForm } from 'react-hook-form'
import { useScreenClass } from 'react-grid-system'
import useResourceLoader from '../../../libs/hooks/lesson/publishing/useResourceLoader'
import useLessonPublishing from '../../../libs/hooks/lesson/publishing/useLessonPublishing'
import useSynthesisVoiceEditor from '../../../libs/hooks/lesson/useSynthesisVoiceEditor'
import { isDataURL } from '../../../libs/utils'
import Header from '../../authoringHeader'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Aspect16To9Container from '../../aspect16To9Container'
import AbsoluteContainer from '../../absoluteContainer'
import TransitionContainer from '../../transitionContainer'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import InputFile from '../../form/inputFile'
import InputText from '../../form/inputText'
import InputTel from '../../form/inputTel'
import InputRadio from '../../form/inputRadio'
import Select from '../../form/select'
import Textarea from '../../form/textarea'
import Label from '../../form/label'
import IconButton from '../../button/iconButton'
import LabelButton from '../../button/labelButton'
import LoadingIndicator from '../../loadingIndicator'
import { RgbaColorPicker } from 'react-colorful'
import 'react-colorful/dist/index.css'
import FormGroup from './formGroup'
import NoImage from '../../noImage'
import ErrorText from './errorText'
import SynthesisVoiceConfig from '../../synthesisVoiceConfig'
import useSettingUpdater from '../../../libs/hooks/lesson/publishing/useSettingUpdater'

export default function LessonPublishing({ lesson, material }) {
  const screenClass = useScreenClass()
  const { isLoading, subjects, categories, allLessons, allLessonOptions, bgImages, bgImageOptions, avatars, avatarOptions, handleSubjectChange: onSubjectChange } = useResourceLoader({ lesson })
  const { sampleTextForSynthesisRef, setting, dispatchSetting, handleFormSubmit } = useSettingUpdater({ isLoading, lesson, bgImages })
  const defaultValues = { title: lesson.title, description: lesson.description, ...Object.fromEntries(lesson.references.map((ref, i) => [`reference${i}`, ref.isbn])) }
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues })
  const { onChange: handleCategorySelectChange, ...categoryIDSelectProps } = register('categoryID', { required: true })
  const { isExtendedOtherSetting, inputFileRef, newReferenceRef, isAddingReference, relationLessonThumbnailURL, isAvatarLoading, avatarRef, avatarLight,
    handleExtendSettingClick, handleTitleChange, handleDescriptionChange, handleThumbnailUploadingClick, handleThumbnailChange, handleStatusChange, handleSubjectChange, handleCategoryChange,
    handlePrevLessonChange, handleNextLessonChange, handleAddReferenceClick, handleRemoveReferenceClick, handleReferenceISBNBlur, handleReferenceNameBlur, handleBgImageChange, handleAvatarChange, handleColorChange } =
      useLessonPublishing({ lesson, material, setFormValue: setValue, handleCategorySelectChange, isLoading, onSubjectChange, avatars, allLessons, setting, dispatchSetting })
  const { setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesizing } =
    useSynthesisVoiceEditor({ dispatchConfig: dispatchSetting, subtitle: sampleTextForSynthesisRef.current, synthesisConfig: setting.voiceSynthesisConfig, dispatchSetting })

  return (
    <>
      <Header currentPage='publishing' />
      <main css={mainStyle}>
        <div css={bodyStyle}>
          <Spacer height='70' />

          <ContainerSpacer left='30' right='30'>
            <Flex>
              <FlexItem flexShrink='0'>
                <Container width='300'>
                  <Aspect16To9Container>
                    <AbsoluteContainer top='0' left='0'>
                      {setting.thumbnailURL && !isDataURL(setting.thumbnailURL) && <Image src={setting.thumbnailURL}/>}
                      {setting.thumbnailURL && isDataURL(setting.thumbnailURL) && <img src={setting.thumbnailURL} css={thumbnailStyle} />}
                      {!setting.thumbnailURL && <NoImage textSize='16' color='gray' backgroundColor='lightgray' />}
                    </AbsoluteContainer>
                    <AbsoluteContainer top='125px' left='260px'>
                      <Container width='35'>
                        <InputFile accept="image/jpeg,image/png,image/gif" onChange={handleThumbnailChange} ref={inputFileRef} />
                        <IconButton name='photo-upload' onClick={handleThumbnailUploadingClick} />
                      </Container>
                    </AbsoluteContainer>
                  </Aspect16To9Container>
                </Container>
              </FlexItem>
              <FlexItem flexBasis='100%'>
                <ContainerSpacer left='20'>
                  <Container height='20'>
                    <InputText size='18' color='gray' borderWidth='0' placeholder='授業の名前を入力' onChange={handleTitleChange} {...register('title', { required: true })} />
                  </Container>
                  <Spacer height='20' />
                  <Container height='130'>
                    <Textarea size='14' color='gray' borderColor='lightgray' borderWidth='1px' padding='10' placeholder='授業の概要を入力' maxLength='300' onChange={handleDescriptionChange} {...register('description', { required: true })} />
                  </Container>
                </ContainerSpacer>
              </FlexItem>
            </Flex>
            <Flex>
              <FlexItem flexShrink='0'>
                <Spacer width='320' />
              </FlexItem>
              <FlexItem flexBasis='100%'>
                <ErrorText isShow={errors?.title || errors?.description} body={errors?.title ? '授業のタイトルを入力してください' : '授業の概要を入力してください'} />
              </FlexItem>
            </Flex>

            <FormGroup name='カテゴリ'>
              <Flex>
                <FlexItem flexBasis='25%'>
                  <Select size='15' color='gray' options={subjects} value={setting.subjectID} topLabel={null} onChange={handleSubjectChange} />
                </FlexItem>
                <Spacer width='30' />
                <FlexItem flexBasis='75%'>
                  <Select size='15' color='gray' options={categories} value={setting.categoryID} key={setting.categoryID} {...categoryIDSelectProps} onChange={handleCategoryChange} />
                </FlexItem>
              </Flex>
              <Flex>
                <FlexItem flexBasis='25%' />
                <Spacer width='30' />
                <FlexItem flexBasis='75%'>
                  <ErrorText isShow={errors?.categoryID} body='単元を選択してください' />
                </FlexItem>
              </Flex>
            </FormGroup>

            <FormGroup name='公開範囲'>
              <div>
                <InputRadio id='statusDraft' name='lessonStatus' size='12' color='gray' value='draft' checked={setting.status === 'draft'} onChange={handleStatusChange}>
                  <PlainText color='gray' size='16'>下書き</PlainText>
                </InputRadio>
              </div>
              <Label targetFor='statusDraft'>
                <PlainText color='gray' size='11'>自分だけが授業を確認できます。</PlainText>
              </Label>
              <Spacer height='30' />
              <div>
                <InputRadio id='statusLimited' name='lessonStatus' size='12' color='gray' value='limited' checked={setting.status === 'limited'} onChange={handleStatusChange}>
                  <PlainText color='gray' size='16'>限定公開</PlainText>
                </InputRadio>
              </div>
              <Label targetFor='statusLimited'>
                <PlainText color='gray' size='11'>URLを知っている人だけが授業を閲覧できます。</PlainText>
              </Label>
              <Spacer height='30' />
              <div>
                <InputRadio id='statusPublic' name='lessonStatus' size='12' color='gray' value='public' checked={setting.status === 'public'} onChange={handleStatusChange}>
                  <PlainText color='gray' size='16'>全体公開</PlainText>
                </InputRadio>
              </div>
              <Label targetFor='statusPublic'>
                <PlainText color='gray' size='11'>全ての人が授業を閲覧できます。トップページや検索結果にも表示されます。</PlainText>
              </Label>
            </FormGroup>

            <FormGroup name='シリーズ'>
              <PlainText color='gray' size='13'>前の授業</PlainText>
              <Flex>
                <FlexItem flexShrink='0'>
                  <Container width='170'>
                    <Aspect16To9Container>
                      <AbsoluteContainer top='0' left='0'>
                        {!relationLessonThumbnailURL.prev && <NoImage textSize='12' color='gray' backgroundColor='lightgray' />}
                        {relationLessonThumbnailURL.prev && <Image src={relationLessonThumbnailURL.prev} width={1280} height={720} />}
                      </AbsoluteContainer>
                    </Aspect16To9Container>
                  </Container>
                </FlexItem>
                <Spacer width='50' />
                <Select size='14' color='gray' options={allLessonOptions} value={setting.prevLessonID} disabled={allLessonOptions.length === 0} onChange={handlePrevLessonChange} />
              </Flex>
              <Spacer height='30' />
              <PlainText color='gray' size='13'>次の授業</PlainText>
              <Flex>
                <FlexItem flexShrink='0'>
                  <Container width='170'>
                    <Aspect16To9Container>
                      <AbsoluteContainer top='0' left='0'>
                        {!relationLessonThumbnailURL.next && <NoImage textSize='12' color='gray' backgroundColor='lightgray' />}
                        {relationLessonThumbnailURL.next && <Image src={relationLessonThumbnailURL.next} width={1280} height={720} />}
                      </AbsoluteContainer>
                    </Aspect16To9Container>
                  </Container>
                </FlexItem>
                <Spacer width='50' />
                <Select size='14' color='gray' options={allLessonOptions} value={setting.nextLessonID} disabled={allLessonOptions.length === 0} onChange={handleNextLessonChange} />
              </Flex>
            </FormGroup>

            <FormGroup name='参考図書'>
              {setting.references && setting.references.map((reference, i) => (
                <div key={i}>
                  <Flex>
                    <InputTel size='16' color='gray' borderColor='gray' borderWidth='0 0 1px' placeholder='ISBNを13桁で入力' maxLength='13'
                      data-index={i} key={reference.isbn} onBlur={handleReferenceISBNBlur} defaultValue={reference.isbn} {...register(`reference${i}`, { required: true, pattern: /^[0-9]{12}[0-9Xx]{1}$/ })} />
                    <Spacer width='20' />
                    <Container width='20'>
                      <IconButton name='square-remove' data-index={i} onClick={handleRemoveReferenceClick} />
                    </Container>
                  </Flex>
                  <InputText size='14' color='gray' borderWidth='0' maxLength='50' placeholder='書名を入力' data-index={i} key={reference.name} defaultValue={reference.name} onBlur={handleReferenceNameBlur} />
                  <ErrorText isShow={errors && errors[`reference${i}`]} body={errors[`reference${i}`]?.type === 'required' ? 'ISBNを入力してください' : 'ISBNは0〜9の半角数字とXで入力してください'} />
                  <Spacer height='20' />
                </div>
              ))}
              {(!setting.references || setting.references.length < 10) && <>
                <Flex>
                  <InputTel size='16' color='gray' borderColor='gray' borderWidth='0 0 1px' placeholder='ISBNを13桁で入力' maxLength='13' ref={newReferenceRef} />
                  <Spacer width='20' />
                  <Container width='20'>
                    <IconButton name='square-add' isProcessing={isAddingReference} onClick={handleAddReferenceClick} />
                  </Container>
                </Flex>
              </>}
            </FormGroup>

            <Flex justifyContent='center'>
              <Container width='130'>
                <LabelButton onClick={handleExtendSettingClick}>
                  <PlainText size='14' color='gray'>その他の設定</PlainText>
                </LabelButton>
              </Container>
            </Flex>

            <TransitionContainer isShow={isExtendedOtherSetting} name='other-setting' duration={300}>
              <FormGroup name='背景・アバター'>
                <Flex>
                  <FlexItem flexShrink='0'>
                    <Container width='250' height='132'>
                      <Aspect16To9Container backgroundColor='lightgray'>
                        <div css={bgImageStyle}>
                          {setting.backgroundImageURL && <Image src={setting.backgroundImageURL} width={1280} height={720} />}
                        </div>
                        <div ref={avatarRef} css={avatarContainerStyle} />
                        {isAvatarLoading && <div css={avatarContainerStyle}><LoadingIndicator size='40' /></div>}
                      </Aspect16To9Container>
                    </Container>
                  </FlexItem>
                  <Spacer width='50' />
                  <div css={fullLineStyle}>
                    <div css={selectStyle}>
                      <Select size='14' color='gray' options={bgImageOptions} value={setting.backgroundImageID} topLabel={null} onChange={handleBgImageChange} />
                    </div>
                    <Spacer height='30' />
                    <div css={selectStyle}>
                      <Select size='14' color='gray' options={avatarOptions} value={setting.avatarID} topLabel={null} onChange={handleAvatarChange} disabled={isAvatarLoading} />
                    </div>
                    <Spacer height='20' />
                    <div css={pickerStyle}>
                      <RgbaColorPicker color={avatarLight} onChange={handleColorChange} />
                    </div>
                  </div>
                </Flex>
              </FormGroup>

              <FormGroup name='合成音声'>
                <SynthesisVoiceConfig isProcessing={isSynthesizing} synthesisConfig={setting.voiceSynthesisConfig} setLanguageCode={setLanguageCode} setName={setName}
                  setSpeakingRate={setSpeakingRate} setPitch={setPitch} setVolumeGainDb={setVolumeGainDb} playVoice={playVoice} />
              </FormGroup>
            </TransitionContainer>
          </ContainerSpacer>

          <Spacer height='50' />

          <Flex justifyContent='center'>
            <Container width='120' height='40'>
              <LabelButton color='var(--soft-white)' fontSize='15' backgroundColor='var(--dark-purple)' disabled={isLoading} onClick={handleSubmit(handleFormSubmit)}>更新</LabelButton>
            </Container>
          </Flex>

          <Spacer height='100' />
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
  maxWidth: '900px',
  height: '100%',
})

const thumbnailStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})

const bgImageStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
})

const avatarContainerStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
})

const fullLineStyle = css({
  width: '100%',
})

const selectStyle = css({
  width: '100%',
  height: '30px',
})

const pickerStyle = css({
  '.react-colorful': {
    width: '100px',
    height: '120px',
  },
})