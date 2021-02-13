/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LoadingIndicator from '../../../components/loadingIndicator'

export default function LessonRecordLoadinIndicator({ isLoading }) {
  const bodyStyle = css({
    display: isLoading ? 'block' : 'none',
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