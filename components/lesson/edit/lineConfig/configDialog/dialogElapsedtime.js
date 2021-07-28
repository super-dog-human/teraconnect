import React, { useState, useRef, useEffect } from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import AlignContainer from '../../../../alignContainer'
import Spacer from '../../../../spacer'
import PlainText from '../../../../plainText'
import InputCheckbox from '../../../../form/inputCheckbox'
import InputElapsedTime from './inputElapsedTime'

const DialogElapsedTime = React.forwardRef(function dialogElapsedTime({ elapsedTime, dispatchConfig }, ref) {
  const [minutesTime, setMinutesTime] = useState('')
  const [secondsTime, setSecondsTime] = useState('')
  const [millisecTime, setMillisecTime] = useState('')
  const [hasChangedElapsedTime, setHasChangedElapsedTime] = useState(false)
  const initializedRef = useRef(false)

  function handleInputFocus() {
    setHasChangedElapsedTime(true)
  }

  useEffect(() => {
    if (initializedRef.current) return

    const minutes = Math.floor(elapsedTime / 60) % 60
    setMinutesTime(minutes.toString())
    const seconds = Math.floor(elapsedTime - minutes * 60).toString()
    setSecondsTime(seconds.padStart(2, '0'))
    const milliSeconds = (parseFloat((elapsedTime - Math.floor(elapsedTime)).toFixed(3)) * 1000).toString()
    setMillisecTime(milliSeconds.padStart(3, '0'))

    initializedRef.current = true
  }, [elapsedTime])

  useEffect(() => {
    if ([minutesTime, secondsTime, millisecTime].includes('')) return

    const newElapsedTime = parseFloat((parseInt(minutesTime) * 60 + parseInt(secondsTime) + (parseInt(millisecTime) /  1000)).toFixed(3))
    dispatchConfig({ type: 'elapsedTime', payload: newElapsedTime })
  }, [minutesTime, secondsTime, millisecTime, dispatchConfig])

  return (
    <div>
      <Flex justifyContent='start' alignItems='center'>
        <Container width='40'>
          <InputElapsedTime time={minutesTime} setTime={setMinutesTime} min='0' max='9' maxLength='1' onFocus={handleInputFocus} />
        </Container>
        <Container width='20'>
          <AlignContainer textAlign='center'>
            <PlainText size='13' color='var(--border-gray)'>分</PlainText>
          </AlignContainer>
        </Container>
        <Container width='40'>
          <InputElapsedTime time={secondsTime} setTime={setSecondsTime} min='0' max='59' maxLength='2' onFocus={handleInputFocus} />
        </Container>
        <Container width='20'>
          <AlignContainer textAlign='center'>
            <PlainText size='13' color='var(--border-gray)'>秒</PlainText>
          </AlignContainer>
        </Container>
        <Container width='50'>
          <InputElapsedTime time={millisecTime} setTime={setMillisecTime} min='0' max='999' maxLength='3' onFocus={handleInputFocus} />
        </Container>
        <Spacer width='10' />
        {hasChangedElapsedTime &&
          <Flex>
            <InputCheckbox id='involveAfteLinesCheckbox' size='18' borderColor='var(--border-gray)' checkColor='var(--soft-white)' ref={ref}>
              <PlainText size='11' color='var(--border-gray)'>後続の行にも時間変更を波及</PlainText>
            </InputCheckbox>
          </Flex>
        }
      </Flex>
      <Spacer height='5' />
    </div>
  )
})

export default DialogElapsedTime