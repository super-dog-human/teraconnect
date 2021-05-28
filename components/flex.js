/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Flex({ children, direction, justifyContent, alignItems, flexWrap }) {
  const bodyStyle = css({
    display: 'flex',
    flexDirection: direction,
    justifyContent,
    alignItems,
    flexWrap,
  })

  return (
    <div css={bodyStyle}>
      {children}
    </div>
  )
}