/** @jsx jsx */
import React from 'react'
import Link from 'next/link'
import { jsx, css } from '@emotion/core'
import { useForm } from 'react-hook-form'
import SubjectAndCategorySelector from './subjectAndCategorySelector'
import InputText from '../../form/inputText'

const bodyStyle = css({
  minHeight: '100%',
  backgroundColor: 'var(--bg-light-gray)'
})

export default function LessonNewForm(props) {
  const { register, errors, handleSubmit, setValue } = useForm()
  const onSubmit = data => {
    console.log(data)
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) } css={ bodyStyle }>
      <div>
        <label>
          <input type="radio" name="createMethod" value="useVoice" ref={ register({ required: true }) } />
            自分の声で授業を作成する。
        </label>
        <hr className=""/>
        <div>マイクを使って、自分の声を録音しながら授業を進めていきます。</div>
      </div>
      <div>
        <label>
          <input type="radio" name="createMethod" value="useText" ref={ register({ required: true }) } />
            テキストを入力して授業を作成する。
        </label>
        <hr />
        <div>セリフを入力し、AIによる合成音声を出力します。手持ちの音声ファイルも使用できます。</div>
      </div>


      <SubjectAndCategorySelector subjects={ props.subjects } setValue={ setValue } errors={ errors } register={ register } />

      <InputText name="name" ref={ register({ required: true }) } />
      { errors.name && '入力してください' }

      <button type="submit">送信</button>
    </form>
  )
}