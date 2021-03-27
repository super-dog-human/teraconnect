import React, { useEffect, useState } from 'react'
import InputText from '../../../../form/inputText'
import { floatSecondsToMinutesFormat } from '../../../../../libs/utils'

export default function DialogFooter({ elapsedtime }) {
  const [displayTime, setDisplayTime] = useState('')

  useEffect(() => {
    const secondsString = floatSecondsToMinutesFormat(elapsedtime)
    const decimalString = elapsedtime.toString().split('.')[1]
    setDisplayTime(secondsString + '.' + decimalString)
  }, [elapsedtime])

  return (
    <InputText defaultValue={displayTime} size='15' color='var(--soft-white)' borderWidth='0' maxLength='9' />
  )
}