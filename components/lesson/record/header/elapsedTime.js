/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/react'
import { floatSecondsToMinutesFormat } from '../../../../libs/utils'

export default function ElapsedTime({ elapsedSeconds }) {
  const [displayTime, setDisplayTime] = useState('')

  useEffect(() => {
    setDisplayTime(floatSecondsToMinutesFormat(elapsedSeconds))
  }, [elapsedSeconds])

  return (
    <span>
      <span css={textStyle}>{displayTime}</span>
    </span>
  )
}

const textStyle = css({
  fontSize: '15px',
  lineHeight: '40px',
  letterSpacing: '1px',
  color: 'lightGray',
})