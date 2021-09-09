/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import PlainText from '../../plainText'

export default function Heading({ name, children }) {
  return (
    <div css={containerStyle}>
      <div css={headingStyle}>
        <PlainText size='20' color='var(--border-dark-gray)'>{name}</PlainText>
      </div>
      <div css={bodyStyle}>
        {children}
      </div>
    </div>
  )
}

const containerStyle = css({
  margin: '70px 30px',
})

const headingStyle = css({
  marginBottom: '15px',
})

const bodyStyle = css({
  marginLeft: '20px',
  marginRight: '20px',
})