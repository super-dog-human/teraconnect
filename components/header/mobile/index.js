/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import { useRouter } from 'next/router'
import Flex from '../../flex'
import IconButton from '../../button/iconButton'
import Container from '../../container'
import AbsoluteContainer from '../../absoluteContainer'
import Spacer from '../../spacer'
import PageLink from '../../pageLink'
import Menu from './menu'
import SearchBar from './searchBar'

export default function MobileHeader() {
  const router = useRouter()
  const [isMobileMenuShow, setIsMobileMenuShow] = useState(false)

  function handleMenuDismiss() {
    setIsMobileMenuShow(false)
  }

  function handleMenuTouchEnd(e) {
    setIsMobileMenuShow(s => !s)
    e.stopPropagation()
  }

  return (
    <header css={headerStyle} className="header-z" onTouchEnd={handleMenuDismiss}>
      {router.pathname === '/search' && <SearchBar handleMenuTouchEnd={handleMenuTouchEnd} />}
      {router.pathname !== '/search' &&
        <>
          <PageLink path='/'>
            <Flex justifyContent='center' alignItems='center'>
              <Spacer height='60' />
              <img src={'/img/logo_black.png'} srcSet={'/img/logo_black.png 1x, /img/logo_black@2x.png 2x'} alt='TERACONNECTロゴ' css={logoStyle} />
            </Flex>
          </PageLink>
          <AbsoluteContainer top='0' right='0'>
            <Flex alignItems='center'>
              <Spacer height='60'/>
              <Container width='40'>
                <IconButton name='menu' padding='11' onTouchEnd={handleMenuTouchEnd} />
              </Container>
            </Flex>
          </AbsoluteContainer>
        </>
      }
      <Menu isShow={isMobileMenuShow} setIsShow={setIsMobileMenuShow} currentPage={router.pathname } />
    </header>
  )
}

const headerStyle = css({
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  backgroundColor: 'white',
  userSelect: 'none',
})

const logoStyle = css({
  width: '181px',
  height: '25px',
})