/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function LessonDurationTime({ durationSec }) {
  return (
    <div css={bodyStyle}>
      {durationSec && <>
        <span css={labelStyle}>収録時間</span>
        <span css={elapsedTimeStyle}>
          {floatSecondsToMinutesFormat(durationSec)}
        </span>
      </>}
    </div>
  )
}

const bodyStyle = css({
  height: '45px',
  marginTop: '20px',
  textAlign: 'right',
  color: 'gray', // fixme
})

const labelStyle = css({
  fontSize: '15px',
})

const elapsedTimeStyle = css({
  fontSize: '30px',
  letterSpacing: '2px',
  paddingLeft: '10px',
})