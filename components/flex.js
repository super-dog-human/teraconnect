/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function Flex({ children, flexDirection, justifyContent, alignItems, alignContent, flexWrap, gap }) {
  const bodyStyle = css({
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    alignContent,
    flexWrap,
    gap,
  })

  return (
    <div css={bodyStyle}>
      {children}
    </div>
  )
}