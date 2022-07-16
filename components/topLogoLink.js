/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import ContainerSpacer from './containerSpacer'
import Container from './container'
import PageLink from './pageLink'

export default function TopLogoLink({ color }) {
  return (
    <ContainerSpacer left='20'>
      <PageLink path='/'>
        <Container width='181' height='25'>
          <div css={backgroundStyle}>
            <img css={logoStyle} src={`/img/logo_${color}.png`} srcSet={`/img/logo_${color}.png 1x, /img/logo_${color}@2x.png 2x`} alt='TERACONNECTロゴ' />
          </div>
        </Container>
      </PageLink>
    </ContainerSpacer>
  )
}

const backgroundStyle = css({
  fontSize: '0',
})

const logoStyle = css({
  verticalAlign: 'middle',
  width: '181px',
  height: '25px',
})