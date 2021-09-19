/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { css } from '@emotion/core'
import { useScreenClass } from 'react-grid-system'
import useMobileDetector from '../../libs/hooks/useMobileDetector'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import Container from '../container'
import AbsoluteContainer from '../absoluteContainer'
import Spacer from '../spacer'
import Flex from '../flex'
import FlexItem from '../flexItem'
import Icon from '../icon'
import IconButton from '../button/iconButton'
import PageLink from '../pageLink'
import TopLogoLink from '../topLogoLink'
import MenuLink from './menuLink'
import LinkLabel from './linkLabel'
import SearchBox from './searchBox'
import AlgoliaSearchBox from './algoliaSearchBox'
import ContainerSpacer from '../containerSpacer'
import MobileMenu from './mobileMenu'

export default function Header({ currentPage }) {
  const router = useRouter()
  const screenClass = useScreenClass()
  const [session, loading] = useSession()
  const [isHover, setIsHover] = useState(false)
  const [isMobileMenuShow, setIsMobileMenuShow] = useState(false)
  const [isSearchBoxFocus, setIsSearchBoxFocus] = useState(!!router.query.q)
  const [isShowMenus, setIsShowMenus] = useState(true)
  const isMobile = useMobileDetector()

  function handleMouseEnter() {
    setIsHover(true)
  }

  function handleMouseLeave() {
    setIsHover(false)
  }

  function handleCloseSearchBox() {
    if (isSearchBoxFocus) return
    setIsShowMenus(true)
  }

  function handleMenuDismiss() {
    setIsMobileMenuShow(false)
  }

  function handleMenuTouchEnd(e) {
    setIsMobileMenuShow(s => !s)
    e.stopPropagation()
  }

  useEffect(() => {
    if (!isSearchBoxFocus) return
    if (screenClass !== 'md') return
    setIsShowMenus(false)
  }, [isSearchBoxFocus, screenClass])

  return (
    <header css={headerStyle} className="header-z" onTouchEnd={handleMenuDismiss}>
      {isMobile === true && router.pathname !== '/search' &&
        <>
          <div>
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
          </div>
          <MobileMenu isShow={isMobileMenuShow} setIsShow={setIsMobileMenuShow} />
        </>
      }
      {isMobile === false &&
        <div css={bodyStyle}>
          <Flex justifyContent='space-between' alignItems='center'>
            <FlexItem flexBasis='201px'>
              <TopLogoLink color="black" />
            </FlexItem>
            <FlexItem />
            {isShowMenus &&
              <FlexItem flexBasis='40%'>
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <Flex justifyContent='space-evenly'>
                    <MenuLink isHover={isHover} page='analytics' currentPage={currentPage} path='/categories'>
                      <Flex justifyContent='center'>
                        <Container width='18'><Icon name='book' /></Container>
                        <Spacer width='10' />
                        <LinkLabel label='教科で探す' />
                      </Flex>
                    </MenuLink>
                    <MenuLink isHover={isHover} page='edit' currentPage={currentPage} path='/users'>
                      <Flex justifyContent='center'>
                        <Container width='22'><Icon name='graduation-hat' /></Container>
                        <Spacer width='10' />
                        <LinkLabel label='人で探す' />
                      </Flex>
                    </MenuLink>
                  </Flex>
                </div>
              </FlexItem>
            }
            <FlexItem>
              <Flex justifyContent='end' alignItems='center'>
                {router.pathname === '/search' && <AlgoliaSearchBox isFocus={isSearchBoxFocus} setIsFocus={setIsSearchBoxFocus} onClose={handleCloseSearchBox} />}
                {router.pathname !== '/search' && <SearchBox isFocus={isSearchBoxFocus} setIsFocus={setIsSearchBoxFocus} onClose={handleCloseSearchBox} />}
                <FlexItem flexBasis='150px'>
                  <ContainerSpacer left='30' right='10'>
                    <Container width='110'>
                      {!loading && !session &&
                        <PageLink path='/login'>
                          <button className="light" css={buttonStyle}>授業をつくる</button>
                        </PageLink>
                      }
                      {!loading && session &&
                        <PageLink path='/dashboard'>
                          <button className="dark" css={buttonStyle}>マイページ</button>
                        </PageLink>
                      }
                    </Container>
                  </ContainerSpacer>
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        </div>
      }
    </header>
  )
}

const headerStyle = css({
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  backgroundColor: 'rgba(255,255,255,0.96)',
  userSelect: 'none',
})

const bodyStyle = css({
  maxWidth: '1280px',
  height: '60px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const buttonStyle = css({
  width: '110px',
  height: '39px',
  fontSize: '15px',
  lineHeight: '15px',
})

const logoStyle = css({
  width: '181px',
  height: '25px',
})