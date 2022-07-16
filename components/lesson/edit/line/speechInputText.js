/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import InputText from '../../../form/inputText'

const SpeechInputText = React.forwardRef(function SpeechInputText(props, ref) {
  const { defaultValue, ...inputProps } = props

  return (
    <div css={bodyStyle}>
      <InputText key={defaultValue} ref={ref} size='14' color='var(--dark-gray)' borderColor='var(--dark-purple)' borderWidth='0'
        defaultValue={defaultValue} {...inputProps} />
    </div>
  )
})

export default SpeechInputText

const bodyStyle = css({
  width: '100%',
  height: '55px',
})