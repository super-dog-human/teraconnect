/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LessonEditKindIcon from './kindIcon'

export default function LessonEditSpeechButton({ isLoading, isPlaying, onClick }) {
  const bodyStyle = css({
    filter: isPlaying ? 'contrast(400%)' : '',
    [':hover']: {
      opacity: '0.6',
    },
  })

  return (
    <LessonEditKindIcon kind={isLoading ? 'loading' : 'speech'} css={bodyStyle} onClick={onClick} />
  )
}