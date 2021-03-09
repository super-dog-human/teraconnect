/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from 'react'
import { css } from '@emotion/core'
import InputText from '../../../form/inputText'

export default function LessonEditSpeechInputText({ defaultValue, onKeyDown, onChange, readOnly, isFocus }) {
  const inputTextRef = useRef()

  useEffect(() => {
    if (!isFocus) return
    inputTextRef.current.focus()
  }, [])

  return (
    <div css={bodyStyle}>
      <InputText css={inputStyle} key={defaultValue} ref={inputTextRef} defaultValue={defaultValue} onKeyDown={onKeyDown} onChange={onChange} readOnly={readOnly} />
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