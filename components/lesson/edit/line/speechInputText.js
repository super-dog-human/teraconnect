/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'
import InputText from '../../../form/inputText'

const LessonEditSpeechInputText = React.forwardRef(function lessonEditSpeechInputText({ defaultValue, onKeyDown, onBlur, readOnly, isFocus }, ref) {
  useEffect(() => {
    if (!isFocus) return
    ref.current.focus()
  }, [])

  return (
    <div css={bodyStyle}>
      <InputText css={inputStyle} key={defaultValue} ref={ref} defaultValue={defaultValue} onKeyDown={onKeyDown} onBlur={onBlur} readOnly={readOnly} />
    </div>
  )
})

export default LessonEditSpeechInputText

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