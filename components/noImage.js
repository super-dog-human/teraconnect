/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import PlainText from './plainText'

export default function NoImage({ textSize, color, backgroundColor }) {
  const bodyStyle = css({
    backgroundColor,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })

  return (
    <div css={bodyStyle}>
      <PlainText size={textSize} lineHeight={textSize} color={color}>NO IMAGE</PlainText>
    </div>
  )
}