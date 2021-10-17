/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'
import PlainText from '../../plainText'

export default function DurationTime() {
  const { durationSec } = useLessonEditorContext()

  return (
    <div css={bodyStyle}>
      {!!durationSec && <>
        <span css={labelStyle}>収録時間</span>
        <span css={elapsedTimeStyle}>
          {floatSecondsToMinutesFormat(Math.round(durationSec))}
        </span>
      </>}
      {durationSec > 600 && <PlainText size='12' color='var(--error-red)'>収録時間が10分を超えています。</PlainText>}
    </div>
  )
}

const bodyStyle = css({
  height: '70px',
  marginTop: '20px',
  textAlign: 'right',
  color: 'gray',
})

const labelStyle = css({
  fontSize: '13px',
})

const elapsedTimeStyle = css({
  fontSize: '30px',
  letterSpacing: '2px',
  paddingLeft: '10px',
})