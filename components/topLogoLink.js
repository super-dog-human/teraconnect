/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { css } from '@emotion/core'

export default function TopLogoLink({ color }) {
  return (
    <div css={bodyStyle}>
      <Link href="/">
        <a>
          <img css={logoStyle} src={`/img/logo_${color}.png`} srcSet={`/img/logo_${color}.png 1x, /img/logo_${color}@2x.png 2x`} />
        </a>
      </Link>
    </div>

  )
}

const bodyStyle = css({
  width: '100%',
  textAlign: 'left',
})

const logoStyle = css({
  width: '181px',
  height: '25px',
  verticalAlign: 'middle',
  marginLeft: '20px',
})