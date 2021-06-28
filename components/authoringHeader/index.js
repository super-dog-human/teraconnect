/** @jsxImportSource @emotion/react */
import React, { useRef, useState } from 'react'
import { css } from '@emotion/core'
import { useScreenClass } from 'react-grid-system'
import { useRouter } from 'next/router'
import Container from '../container'
import Spacer from '../spacer'
import Flex from '../flex'
import Icon from '../icon'
import PlainText from '../plainText'
import TopLogoLink from '../topLogoLink'
import MenuLink from './menuLink'
import IconWithBadgeButton from '../button/iconWithBadgeButton'
import IconButton from '../button/iconButton'
import { useContextMenuContext } from '../../libs/contexts/contextMenuContext'

export default function Header({ currentPage, showBadge, isUpdating, updateLesson, discardLessonDraft }) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
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
    const targetRect = e.currentTarget.getBoundingClientRect()
    setContextMenu({
      labels: ['上書き保存', '変更の破棄'],
      actions: [updateLesson, discardLessonDraft],
      position: { fixed: true, x: targetRect.x, y: targetRect.y + targetRect.height },
      disableMenuIndexes: showBadge ? [] : [0, 1],
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
              <MenuLink isHover={isHover} page='analytics' currentPage={currentPage} path='/'>
                <Flex justifyContent='center'>
                  <Container width='20' height='60'><Icon name='analytics' /></Container>
                  <Spacer width='10' />
                  <PlainText color='white' size='14' lineHeight='60'>レポート</PlainText>
                </Flex>
              </MenuLink>
              {['lg', 'xl', 'xxl'].includes(screenClass) && <Spacer width='100' />}
              <MenuLink isHover={isHover} page='edit' currentPage={currentPage} path={`/lessons/${lessonIDRef.current}/edit`}>
                <Flex justifyContent='center'>
                  <Container width='18' height='60'><Icon name='edit' /></Container>
                  <Spacer width='20' />
                  <PlainText color='white' size='14' lineHeight='60' letterSpacing='5'>編集</PlainText>
                </Flex>
              </MenuLink>
              {['lg', 'xl', 'xxl'].includes(screenClass) && <Spacer width='100' />}
              <MenuLink isHover={isHover} page='publishing' currentPage={currentPage} path={`/lessons/${lessonIDRef.current}/publishing`}>
                <Flex justifyContent='center'>
                  <Container width='23' height='60'><Icon name='cloud-upload' /></Container>
                  <Spacer width='10' />
                  <PlainText color='white' size='13' lineHeight='60'>公開設定</PlainText>
                </Flex>
              </MenuLink>
            </Flex>
          </div>
          <Container width='100' height='40'>
            {currentPage === 'edit' &&
              <Flex>
                <Container width='40' height='40'>
                  <IconWithBadgeButton name='save' padding='10' showBadge={showBadge} isProcessing={isUpdating} disabled={isUpdating} onClick={updateLesson} />
                </Container>
                <Container width='10'>
                  <IconButton name='sort-down' disabled={isUpdating} onMouseDown={handleSortDownClick} />
                </Container>
              </Flex>
            }
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
  height: '60px',
  marginLeft: 'auto',
  marginRight: 'auto',
})