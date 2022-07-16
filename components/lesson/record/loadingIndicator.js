/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import LoadingIndicator from '../../../components/loadingIndicator'
import { useLessonRecorderContext } from '../../../libs/contexts/lessonRecorderContext'

export default function LessonRecordLoadinIndicator({ isLoading }) {
  const { isFinishing } = useLessonRecorderContext()

  const bodyStyle = css({
    display: isLoading || isFinishing ? 'block' : 'none',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  })

  return (
    <div css={bodyStyle} className="indicator-z">
      <LoadingIndicator size={15} />
    </div>
  )
}