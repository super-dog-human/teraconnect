/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function FlexItem({ children, column, flex, flexShrink, flexGrow, flexBasis }) {
  const bodyStyle = css({
    width: column && `calc(100% / ${column})`,
    flex,
    flexShrink,
    flexGrow,
    flexBasis,
  })

  return (
    <div css={bodyStyle}>
      {children}
    </div>
  )
}