/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function ContainerSpacer({ children, top, right, bottom, left }) {
  const bodyStyle = css({
    margin: `${top ? `${top}px`: 'auto'} ${right ? `${right}px`: 'auto'} ${bottom ? `${bottom}px`: 'auto'} ${left ? `${left}px`: 'auto'}`,
  })

  return (
    <div css={bodyStyle}>{children}</div>
  )
}