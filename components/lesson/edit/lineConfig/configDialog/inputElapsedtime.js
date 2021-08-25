import React, { useRef } from 'react'
import InputNumber from '../../../../form/inputNumber'

export default function InputElapsedTime(props) {
  const { time, setTime, min, max, maxLength, onFocus, ...inputProps } = props
  const selectedLengthRef = useRef(0)

  function handleFocus(e) {
    selectedLengthRef.current = e.currentTarget.selectionEnd - e.currentTarget.selectionStart
    onFocus()
  }

  function handleBlur(e) {
    let currentValue, newValue
    currentValue = newValue = e.currentTarget.value

    if (min && parseInt(currentValue) < min) {
      newValue = min
    } else if (max && parseInt(currentValue) > max) {
      newValue = max
    }

    if (maxLength) {
      newValue = newValue.padStart(maxLength, '0')
    }

    e.currentTarget.value = newValue
    setTime(newValue)
  }

  return (
    <InputNumber key={time} defaultValue={time} {...inputProps} maxLength={maxLength} onFocus={handleFocus} onBlur={handleBlur}
      size='15' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' textAlign='center' />
  )
}