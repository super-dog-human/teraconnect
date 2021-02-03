/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function ElapsedTime({ isRecording, elapsedSeconds }) {
  const [displayTime, setDisplayTime] = useState('')

  useEffect(() => {
    const minutes = Math.floor(elapsedSeconds / 60) % 60
    const seconds = Math.floor(elapsedSeconds - minutes * 60)
    setDisplayTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
  }, [elapsedSeconds])

  return (
    <div css={bodyStyle}>
      <span css={textStyle}>{isRecording ? displayTime : '停止中'}</span>
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  left: 60,
})

const textStyle = css({
  fontSize: '13px',
  lineHeight: '40px',
  color: 'lightGray',
})