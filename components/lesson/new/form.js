/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useForm } from 'react-hook-form'
import SubjectAndCategorySelector from './subjectAndCategorySelector'
import InputText from '../../form/inputText'
import useCreatingLesson from './useCreatingLesson'

const bodyStyle = css({
  minHeight: '100%',
  backgroundColor: 'var(--bg-light-gray)'
})

export default function LessonNewForm(props) {
  const { register, errors, handleSubmit, setValue } = useForm()
  const { onSubmit, isCreating } = useCreatingLesson(props.token)

  return (
    <form onSubmit={handleSubmit(onSubmit)} css={bodyStyle}>
      <div>
        <label>
          <input type="radio" name="createMethod" value="useVoice" ref={register({ required: true })} />
            自分の声で授業を作成する。
        </label>
        <hr className=""/>
        <div>マイクを使って、自分の声を録音しながら授業を進めていきます。</div>
      </div>
      <div>
        <label>
          <input type="radio" name="createMethod" value="useText" ref={register({ required: true })} />
            テキストを入力して授業を作成する。
        </label>
        <hr />
        <div>セリフを入力し、AIによる合成音声を出力します。手持ちの音声ファイルも使用できます。</div>
      </div>
      {errors.createMethod && '選択してください'}


      <SubjectAndCategorySelector subjects={props.subjects} setValue={setValue} errors={errors} ref={register({ required: true })} />

      <InputText name="title" maxLength="100" ref={register({ required: true })} />
      { errors.title && '入力してください' }

      <input type="submit" disabled={isCreating} />
    </form>
  )
}