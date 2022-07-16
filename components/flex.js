/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function Flex({ children, flexDirection, justifyContent, alignItems, alignContent, flexWrap, gap, afterWidth }) {
  const bodyStyle = css({
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    alignContent,
    flexWrap,
    gap,
    '::after': afterWidth && {
      content: '""',
      display: 'block',
      width: afterWidth,
      height: 0,
    }
  })

  return (
    <div css={bodyStyle}>
      {children}
    </div>
  )
}