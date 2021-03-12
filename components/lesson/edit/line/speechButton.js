/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from '../../../loadingIndicator'
import LessonEditKindIcon from './kindIcon'

export default function LessonEditSpeechButton({ isLoading, isPlaying, onClick }) {
  const bodyStyle = css({
    filter: isPlaying ? 'contrast(400%)' : '',
    [':hover']: {
      opacity: '0.6',
    },
  })

  return (
    <>
      {isLoading && <div css={loadingStyle}><LoadingIndicator /></div>}
      {!isLoading && <LessonEditKindIcon kind="speech" css={bodyStyle} onClick={onClick} />}
    </>
  )
}

const loadingStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '25px',
  marginLeft: '15px',
  marginRight: '20px',
})