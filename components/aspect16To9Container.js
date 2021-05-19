/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Aspect16To9Container({ children, invisible, backgroundColor }) {
  const bodyStyle = css({
    visibility: invisible && 'hidden',
    position: 'relative', // 子要素をabsoluteで表示する想定
    width: '100%',
    height: 'auto',
    paddingTop: '56.25%',
    backgroundColor: backgroundColor || 'var(--back-movie-black)',
  })

  return (
    <div css={bodyStyle}>
      {children}
    </div>
  )
}