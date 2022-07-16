/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function TabContainer({ children, minHeight }) {
  const bodyStyle = css({
    minHeight: `${minHeight}px`,
    '.react-tabs__tab-list': {
      border: 'none',
    },
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}