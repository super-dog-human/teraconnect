import React from 'react'
import InputText from '../../../../form/inputText'

export default function SpeechInputText({ value, onBlur }) {
  function handleBlur(e) {
    onBlur(e.target.value)
  }

  return (
    <InputText size='18' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' key={value} defaultValue={value} onBlur={handleBlur}/>
  )
}