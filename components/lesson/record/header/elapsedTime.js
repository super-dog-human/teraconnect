/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function ElapsedTime({ elapsedSeconds, className }) {
  const [displayTime, setDisplayTime] = useState('')

  useEffect(() => {
    const minutes = Math.floor(elapsedSeconds / 60) % 60
    const seconds = Math.floor(elapsedSeconds - minutes * 60)
    setDisplayTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
  }, [elapsedSeconds])

  return (
    <span className={className}>
      <span css={textStyle}>{displayTime}</span>
    </span>
  )
}

const textStyle = css({
  fontSize: '13px',
  lineHeight: '40px',
  color: 'lightGray',
})