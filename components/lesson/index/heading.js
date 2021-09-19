/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import PlainText from '../../plainText'

export default function Heading({ isMobile, name, children }) {
  const containerStyle = css({
    margin: isMobile ?  '70px 10px' : '70px 30px',
  })

  const bodyStyle = css({
    marginLeft: !isMobile && '20px',
    marginRight: !isMobile && '20px',
  })

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

const headingStyle = css({
  marginBottom: '15px',
})