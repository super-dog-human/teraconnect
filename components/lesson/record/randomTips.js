/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonRecordRandomTips() {
  const bodyStyle = css({
    width: '100%',
    height: '160px',
    backgroundColor: 'var(--bg-light-gray)',
    textAlign: 'center',
  })

  return (
    <div css={bodyStyle}>
      <div css={{ width: '70%', margin: 'auto' }}>
        <div>TIPS.</div>
        <div>背景に合わせて環境光の色合いを調節すると、アバターの表示が自然になります。</div>
      </div>
    </div>

  )
}
