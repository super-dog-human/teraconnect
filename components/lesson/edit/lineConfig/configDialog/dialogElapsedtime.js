import React, { useState, useEffect } from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import AlignContainer from '../../../../alignContainer'
import Spacer from '../../../../spacer'
import PlainText from '../../../../plainText'
import InputCheckbox from '../../../../form/inputCheckbox'
import InputElapsedTime from './inputElapsedTime'

export default function DialogElapsedTime({ elapsedTime, setConfig }) {
  const [minutesTime, setMinutesTime] = useState('')
  const [secondsTime, setSecondsTime] = useState('')
  const [millisecTime, setMillisecTime] = useState('')
  const [hasChangedElapsedTime, setHasChangedElapsedTime] = useState(false)

  useEffect(() => {
    const minutes = Math.floor(elapsedTime / 60) % 60
    setMinutesTime(minutes.toString())
    const seconds = Math.floor(elapsedTime - minutes * 60).toString()
    setSecondsTime(seconds.padStart(2, '0'))
    const milliSeconds = (elapsedTime.toString().split('.')[1] || 0).toString()
    setMillisecTime(milliSeconds.padStart(3, '0'))
  }, [])

  useEffect(() => {
    if ([minutesTime, secondsTime, millisecTime].includes('')) return

    const newElapsedTime = parseFloat((parseInt(minutesTime) * 60 + parseInt(secondsTime) + (parseInt(millisecTime) /  1000)).toFixed(3))
    if (elapsedTime !== newElapsedTime) {
      setHasChangedElapsedTime(true)
      setConfig(config => {
        config.elapsedTime = newElapsedTime
        return { ...config }
      })
    }
  }, [minutesTime, secondsTime, millisecTime])

  return (
    <div>
      <Flex justifyContent='start' alignItems='center'>
        <Container width='40'>
          <InputElapsedTime time={minutesTime} setTime={setMinutesTime} min='0' max='9' maxLength='1' />
        </Container>
        <Container width='20'>
          <AlignContainer textAlign='center'>
            <PlainText size='13' color='var(--border-gray)'>分</PlainText>
          </AlignContainer>
        </Container>
        <Container width='40'>
          <InputElapsedTime time={secondsTime} setTime={setSecondsTime} min='0' max='59' maxLength='2' />
        </Container>
        <Container width='20'>
          <AlignContainer textAlign='center'>
            <PlainText size='13' color='var(--border-gray)'>秒</PlainText>
          </AlignContainer>
        </Container>
        <Container width='50'>
          <InputElapsedTime time={millisecTime} setTime={setMillisecTime} min='0' max='999' maxLength='3' />
        </Container>
        <Spacer width='10' />
        {hasChangedElapsedTime &&
          <Flex>
            <InputCheckbox id='involveAfteLinesCheckbox' size='18' borderColor='var(--border-gray)' checkColor='var(--soft-white)'>
              <PlainText size='11' color='var(--border-gray)'>後続の行にも時間変更を波及</PlainText>
            </InputCheckbox>
          </Flex>
        }
      </Flex>
      <Spacer height='5' />
    </div>
  )
}