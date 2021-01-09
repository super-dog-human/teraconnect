/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function RecordIcon(props) {
  const recordingStyle = css({
    animation: 'gradation 1s ease-in infinite alternate',
    ['@keyframes gradation']:  {
      ['0%']: { fill: '#ff0000' },
      ['100%']: { fill: '#550000' },
    }
  })

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="50" cy="50" r="44.5" strokeWidth="11" stroke="white" fill="none" />
      <circle cx="50" cy="50" r="24" fill="white" css={props.recording && recordingStyle} />
    </svg>
  )
}