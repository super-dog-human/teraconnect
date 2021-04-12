/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function FlexItem({ children, shrink='1', grow='0', basis='auto' }) {
  const bodyStyle = css({
    flexShrink: shrink,
    flexGrow: grow,
    flexBasis: basis,
  })

  return (
    <div css={bodyStyle}>
      {children}
    </div>
  )
}