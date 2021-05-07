/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'
import InputText from '../../../form/inputText'

const SpeechInputText = React.forwardRef(function SpeechInputText({ defaultValue, onKeyDown, onBlur, readOnly, isFocus }, ref) {
  useEffect(() => {
    if (!isFocus) return
    ref.current.focus()
  }, [])

  return (
    <div css={bodyStyle}>
      <InputText key={defaultValue} ref={ref} size='15' color='var(--dark-gray)' borderWidth='0' defaultValue={defaultValue} onKeyDown={onKeyDown} onBlur={onBlur} readOnly={readOnly} />
    </div>
  )
})

export default SpeechInputText

const bodyStyle = css({
  width: '100%',
  height: '55px',
})