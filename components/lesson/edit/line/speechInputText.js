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
      <InputText key={defaultValue} ref={ref} size='16' color='var(--dark-gray)' borderWidth='0' defaultValue={defaultValue} onKeyDown={onKeyDown} onBlur={onBlur} readOnly={readOnly} />
    </div>
  )
})

export default LessonEditSpeechInputText

const bodyStyle = css({
  width: '100%',
  height: '55px',
})