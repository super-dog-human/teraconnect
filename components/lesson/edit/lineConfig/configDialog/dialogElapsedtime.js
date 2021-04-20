import React, { useEffect, useState } from 'react'
import Container from '../../../../container'
import InputText from '../../../../form/inputText'
import { floatSecondsToMinutesFormat } from '../../../../../libs/utils'

export default function DialogElapsedtime({ elapsedtime }) {
  const [displayTime, setDisplayTime] = useState('')

  useEffect(() => {
    const secondsString = floatSecondsToMinutesFormat(elapsedtime)
    const decimalString = elapsedtime.toString().split('.')[1]
    setDisplayTime(secondsString + '.' + decimalString)
  }, [elapsedtime])

  return (
    <Container width='80'>
      <InputText defaultValue={displayTime} size='15' color='var(--soft-white)' borderWidth='0' maxLength='9' />
    </Container>
  )
}