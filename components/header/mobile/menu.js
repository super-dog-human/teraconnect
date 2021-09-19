/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useSession } from 'next-auth/client'
import Container from '../../container'
import Spacer from '../../spacer'
import TransitionContainer from '../../transition/transitionContainer'
import Flex from '../../flex'
import Icon from '../../icon'
import PlainText from '../../plainText'
import PageLink from '../../pageLink'
import ContainerSpacer from '../../containerSpacer'

export default function Menu({ isShow, setIsShow, currentPage }) {
  const [session, loading] = useSession()

  function handleBackgroundTouchEnd(e) {
    e.stopPropagation(0)
  }

  return (
    <>
      <TransitionContainer isShow={isShow} duration={100}>
        <div css={backgroundStyle} onTouchEnd={() => setIsShow(false)}>
          <Flex justifyContent='flex-end'>
            <div css={bodyStyle} onTouchEnd={handleBackgroundTouchEnd}>
              <PageLink path='/categories'>
                <div css={lineStyle}>
                  <div css={iconStyle}>
                    <Container width='25' height='25'><Icon name='book'/></Container>
                  </div>
                  <Spacer width='15'/>
                  <PlainText color='gray' size='18' lineHeight='35'>教科で探す</PlainText>
                </div>
              </PageLink>
              <Spacer height='10'/>
              <PageLink path='/users'>
                <div css={lineStyle}>
                  <Container width='30' height='30'><Icon name='graduation-hat'/></Container>
                  <Spacer width='15'/>
                  <PlainText color='gray' size='18' lineHeight='35'>人で探す</PlainText>
                </div>
              </PageLink>
              <Spacer height='10'/>
              {currentPage === '/search' &&
                <PageLink path='/'>
                  <div css={lineStyle}>
                    <Flex justifyContent='center'>
                      <div css={iconStyle}>
                        <Container width='25' height='25'><Icon name='home'/></Container>
                      </div>
                    </Flex>
                    <Spacer width='15'/>
                    <PlainText color='gray' size='18' lineHeight='35'>ホーム</PlainText>
                  </div>
                </PageLink>
              }
              {currentPage !== '/search' &&
                <PageLink path='/search'>
                  <div css={lineStyle}>
                    <Flex justifyContent='center'>
                      <div css={iconStyle}>
                        <Container width='25' height='25'><Icon name='search'/></Container>
                      </div>
                    </Flex>
                    <Spacer width='15'/>
                    <PlainText color='gray' size='18' lineHeight='35'>キーワード検索</PlainText>
                  </div>
                </PageLink>
              }
              <Spacer height='10'/>
              {!loading && session &&
                  <ContainerSpacer top='10' bottom='10'>
                    <Flex justifyContent='center'>
                      <PageLink path='/dashboard'>
                        <button className="dark" css={buttonStyle}>マイページ</button>
                      </PageLink>
                    </Flex>
                  </ContainerSpacer>
              }
            </div>
          </Flex>
        </div>
      </TransitionContainer>
    </>
  )
}

const backgroundStyle = css({
  positin: 'absolute',
  top: '-60px',
  right: '0',
  width: '100vw',
  height: 'calc(100vh - 60px)',
})

const bodyStyle = css({
  width: '200px',
  borderRadius: '0px 0px 10px 10px',
  padding: '20px 20px 10px 20px',
  backgroundColor: 'white',
  textAlign: 'center',
})

const lineStyle = css({
  display: 'flex',
  alignItems: 'center',
  height: '35px',
})

const iconStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '30px',
})

const buttonStyle = css({
  width: '140px',
  height: '45px',
  fontSize: '18px',
  lineHeight: '15px',
})