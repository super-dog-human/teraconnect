/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import PlainText from '../../plainText'

export default function ErrorText({ body, isShow }) {
  const bodyStyle = css({
    height: '20px',
    opacity: isShow ? 1 : 0,
  })

  return (
    <div css={bodyStyle}>
      <PlainText size='12' color='var(--error-red)'>{body}</PlainText>
    </div>
  )
}
