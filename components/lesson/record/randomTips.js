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
        <div>ステージ背景に合わせて環境光を設定すると、アバターが自然な表示になります。</div>
      </div>
    </div>

  )
}
