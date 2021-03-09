/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import InputText from '../../../form/inputText'

export default function LessonEditSpeechInputText({ value, onKeyDown, onChange, readOnly }) {
  return (
    <div css={bodyStyle}>
      <InputText css={inputStyle} key={value} defaultValue={value} onKeyDown={onKeyDown} onChange={onChange} readOnly={readOnly} />
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '55px',
})

const inputStyle = css({
  backgroundColor: 'inherit',
  color: '#3c3c3c', // 他の色と揃える
  fontSize: '16px',
  lineHeight: '40px',
  border: 'none',
  [':focus']: {
    outline: 'none',
  },
})