/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import PlainText from '../../plainText'

export default function FormGroup({ name, children }) {
  return (
    <div css={mainStyle}>
      <PlainText size='16' color='gray'>{name}</PlainText>
      <div css={bodyStyle}>
        {children}
      </div>
    </div>
  )
}

const mainStyle = css({
  marginTop: '70px',
  marginBottom: '70px',
})

const bodyStyle = css({
  marginTop: '20px',
  marginLeft: '5%',
})