/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Flex({ children, direction, justifyContent, alignItems }) {
  const bodyStyle = css({
    display: 'flex',
    flexDirection: direction,
    justifyContent,
    alignItems,
  })

  return (
    <div css={bodyStyle}>
      {children}
    </div>
  )
}