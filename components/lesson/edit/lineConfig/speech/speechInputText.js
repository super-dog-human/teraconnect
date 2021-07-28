import React from 'react'
import InputText from '../../../../form/inputText'

export default function SpeechInputText(props) {
  return (
    <InputText size='16' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' key={props.defaultValue} {...props} />
  )
}