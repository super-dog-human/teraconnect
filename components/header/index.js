/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react'
import { css } from '@emotion/react'
import { useScreenClass } from 'react-grid-system'
import useMobileDetector from '../../libs/hooks/useMobileDetector'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Container from '../container'
import Spacer from '../spacer'
import Flex from '../flex'
import FlexItem from '../flexItem'
import Icon from '../icon'
import PageLink from '../pageLink'
import TopLogoLink from '../topLogoLink'
import MenuLink from './menuLink'
import LinkLabel from './linkLabel'
import MobileHeader from './mobile/'
import SearchBox from './searchBox'
import AlgoliaSearchBox from './algoliaSearchBox'
import ContainerSpacer from '../containerSpacer'
import LabelButton from '../button/labelButton'

export default function Header() {
  const router = useRouter()
  const screenClass = useScreenClass()
  const { data: session, status } = useSession()
  const [isHover, setIsHover] = useState(false)
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

  useEffect(() => {
    if (!isSearchBoxFocus) return
    if (screenClass !== 'md') return
    setIsShowMenus(false)
  }, [isSearchBoxFocus, screenClass])

  return (
    <>
      {isMobile === true && <MobileHeader /> }
      {isMobile === false &&
        <header css={headerStyle} className="header-z">
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
                      <Container height='60'>
                        <MenuLink isHover={isHover} isCurrent={router.pathname === '/categories'} path='/categories'>
                          <Flex justifyContent='center'>
                            <Container width='18' height='60'><Icon name='book' /></Container>
                            <Spacer width='10' />
                            <LinkLabel label='教科で探す' />
                          </Flex>
                        </MenuLink>
                      </Container>
                      <Container height='60'>
                        <MenuLink isHover={isHover} isCurrent={router.pathname === '/users'} path='/users'>
                          <Flex justifyContent='center'>
                            <Container width='22' height='60'><Icon name='graduation-hat' /></Container>
                            <Spacer width='10' />
                            <LinkLabel label='人で探す' />
                          </Flex>
                        </MenuLink>
                      </Container>
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
                        {status !== 'loading' && !session &&
                          <PageLink path='/dashboard'>
                            <Container width='110' height='39'>
                              <LabelButton fontSize='15' lineHeight='39' color='var(--text-dark-gray)' borderColor='var(--text-dark-gray)'>
                                ログイン
                              </LabelButton>
                            </Container>
                          </PageLink>
                        }
                        {status !== 'loading' && session &&
                          <PageLink path='/dashboard'>
                            <Container width='110' height='39'>
                              <LabelButton fontSize='15' lineHeight='39' color='white' backgroundColor='var(--dark-gray)' borderColor='var(--dark-gray)'>
                                マイページ
                              </LabelButton>
                            </Container>
                          </PageLink>
                        }
                      </Container>
                    </ContainerSpacer>
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
          </div>
        </header>
      }
    </>
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

const bodyStyle = css({
  maxWidth: '1280px',
  height: '60px',
  marginLeft: 'auto',
  marginRight: 'auto',
})