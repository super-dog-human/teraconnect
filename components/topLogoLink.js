/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from './containerSpacer'
import Container from './container'
import PageLink from './pageLink'

export default function TopLogoLink({ color }) {
  return (
    <ContainerSpacer left='20'>
      <PageLink path='/'>
        <Container width='181' height='25'>
          <img css={logoStyle} src={`/img/logo_${color}.png`} srcSet={`/img/logo_${color}.png 1x, /img/logo_${color}@2x.png 2x`} />
        </Container>
      </PageLink>
    </ContainerSpacer>
  )
}

const logoStyle = css({
  verticalAlign: 'middle',
})