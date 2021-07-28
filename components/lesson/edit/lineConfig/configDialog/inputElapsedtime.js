import React, { useRef } from 'react'
import InputText from '../../../../form/inputText'

export default function InputElapsedTime(props) {
  const { time, setTime, min, max, maxLength, ...inputProps } = props
  const selectedLengthRef = useRef(0)

  function handleFocus(e) {
    selectedLengthRef.current = e.currentTarget.selectionEnd - e.currentTarget.selectionStart
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') return
    if (e.key === 'ArrowRight') return
    if (e.key === 'Tab') return
    if (e.key === 'Backspace') return
    if (e.key === 'Delete') return

    if (selectedLengthRef.current === 0 && e.currentTarget.value.length >= maxLength) {
      e.preventDefault()
      return
    }

    if (/^\D$/.test(e.key)) {
      e.preventDefault()
      return
    }
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
    <InputText key={time} defaultValue={time} {...inputProps} maxLength={maxLength} onFocus={handleFocus} onKeyDown={handleKeyDown} onBlur={handleBlur}
      size='15' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' textAlign='center' />
  )
}