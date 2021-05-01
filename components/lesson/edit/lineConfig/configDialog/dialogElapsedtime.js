import React, { useEffect, useState } from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import AlignContainer from '../../../../alignContainer'
import PlainText from '../../../../plainText'
import InputElapsedTime from './inputElapsedTime'

export default function DialogElapsedTime({ elapsedTime, setConfig }) {
  const [minutesTime, setMinutesTime] = useState('')
  const [secondsTime, setSecondsTime] = useState('')
  const [millisecTime, setMillisecTime] = useState('')

  useEffect(() => {
    const minutes = Math.floor(elapsedTime / 60) % 60
    setMinutesTime(minutes.toString())
    const seconds = Math.floor(elapsedTime - minutes * 60).toString()
    setSecondsTime(seconds.padStart(2, '0'))
    const milliSeconds = (elapsedTime.toString().split('.')[1] || 0).toString()
    setMillisecTime(milliSeconds.padStart(3, '0'))
  }, [])

  useEffect(() => {
    setConfig(config => {
      config.elapsedTime = parseInt(minutesTime) * 60 + parseInt(secondsTime) + (parseInt(millisecTime) /  1000)
      return { ...config }
    })
  }, [minutesTime, secondsTime, millisecTime])

  return (
    <Flex justifyContent='start' alignItems='center'>
      <Container width='70'>
        <PlainText size='13' color='var(--border-gray)'>開始時間</PlainText>
      </Container>
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
    </Flex>
  )
}