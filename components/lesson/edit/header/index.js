/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import { useScreenClass } from 'react-grid-system'
import Container from '../../../container'
import Spacer from '../../../spacer'
import Flex from '../../../flex'
import Icon from '../../../icon'
import PlainText from '../../../plainText'
import TopLogoLink from '../../../topLogoLink'
import MenuLink from './menuLink'
import IconButton from '../../../button/iconButton'
import { useContextMenuContext } from '../../../../libs/contexts/contextMenuContext'

export default function Header({ currentPage }) {
  const [isHover, setIsHover] = useState(false)
  const { setContextMenu } = useContextMenuContext()
  const screenClass = useScreenClass()

  function handleMouseEnter() {
    setIsHover(true)
  }

  function handleMouseLeave() {
    setIsHover(false)
  }

  function handleSortDownClick(e) {
    setContextMenu({
      labels: ['上書き保存', '変更の破棄', 'その他の設定'],
      actions: [() => {}, () => {}, () => {}],
      position: { fixed: true, x: e.pageX, y: e.pageY },
    })
  }

  return (
    <header css={headerStyle} className="header-z">
      <div css={bodyStyle}>
        <Flex justifyContent='space-between' alignItems='center'>
          <div>
            <TopLogoLink color="white" />
          </div>
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Flex>
              <MenuLink isHover={isHover} page='edit' currentPage={currentPage} path='/'>
                <Flex justifyContent='center'>
                  <Container width='20' height='77'><Icon name='edit' /></Container>
                  <Spacer width='20' />
                  <PlainText color='white' size='16' lineHeight='77' letterSpacing='5'>編集</PlainText>
                </Flex>
              </MenuLink>
              {['lg', 'xl', 'xxl'].includes(screenClass) && <Spacer width='100' />}
              <MenuLink isHover={isHover} page='review' currentPage={currentPage} path='/'>
                <Flex justifyContent='center'>
                  <Container width='20' height='77'><Icon name='report' /></Container>
                  <Spacer width='10' />
                  <PlainText color='white' size='17' lineHeight='77' letterSpacing='2'>レビュー</PlainText>
                </Flex>
              </MenuLink>
              {['lg', 'xl', 'xxl'].includes(screenClass) && <Spacer width='100' />}
              <MenuLink isHover={isHover} page='publishing' currentPage={currentPage} path='/'>
                <Flex justifyContent='center'>
                  <Container width='20' height='77'><Icon name='book' /></Container>
                  <Spacer width='10' />
                  <PlainText color='white' size='16' lineHeight='77'>公開設定</PlainText>
                </Flex>
              </MenuLink>
            </Flex>
          </div>
          <Container width='100' height='40'>
            <Flex>
              <Container width='40' height='40'>
                <IconButton name='save' padding='10' />
              </Container>
              <Container width='10'>
                <IconButton name='sort-down' onClick={handleSortDownClick} />
              </Container>
            </Flex>
          </Container>
        </Flex>
      </div>
    </header>
  )
}

const headerStyle = css({
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  backgroundColor: 'var(--dark-gray)',
  userSelect: 'none',
})

const bodyStyle = css({
  maxWidth: '1280px',
  height: '77px',
  marginLeft: 'auto',
  marginRight: 'auto',
})