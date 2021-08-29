/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useForm } from 'react-hook-form'
import SubjectAndCategorySelector from './subjectAndCategorySelector'
import InputText from '../../form/inputText'
import useCreatingLesson from '../../../libs/hooks/lesson/new/useCreatingLesson'

const bodyStyle = css({
  minHeight: '100%',
  backgroundColor: 'var(--bg-light-gray)'
})

export default function LessonNewForm(props) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const { onSubmit, isCreating } = useCreatingLesson()

  return (
    <form onSubmit={handleSubmit(onSubmit)} css={bodyStyle}>
      <div>
        <label>
          <input type="radio" name="createMethod" value="useVoice" {...register('useVoice', { required: true })} />
            自分の声で授業を作成する。
        </label>
        <hr />
        <div>マイクを使って、自分の声を録音しながら授業を進めていきます。</div>
      </div>
      <div>
        <label>
          <input type="radio" name="createMethod" value="useText" {...register('useText', { required: true })} />
            テキストを入力して授業を作成する。
        </label>
        <hr />
        <div>セリフを入力し、AIによる合成音声を出力します。手持ちの音声ファイルも使用できます。</div>
      </div>
      {errors.createMethod && '選択してください'}


      <SubjectAndCategorySelector subjects={props.subjects} setValue={setValue} errors={errors} {...register('subjects', { required: true })} />

      <InputText name="title" maxLength="100" ref={register('title', { required: true })} />
      { errors.title && '入力してください' }

      <input type="submit" disabled={isCreating} />
    </form>
  )
}