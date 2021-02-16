/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { floatSecondsToMinutesFormat } from '../../../../libs/utils'

export default function ElapsedTime({ elapsedSeconds, className }) {
  const [displayTime, setDisplayTime] = useState('')

  useEffect(() => {
    setDisplayTime(floatSecondsToMinutesFormat(elapsedSeconds))
  }, [elapsedSeconds])

  return (
    <span className={className}>
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