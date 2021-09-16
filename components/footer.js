/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useSession } from 'next-auth/client'
import useMobileDetector from '../libs/hooks/useMobileDetector'
import FlexItem from './flexItem'
import PlainText from './plainText'
import PageLink from './pageLink'
import Spacer from './spacer'
import ContainerSpacer from './containerSpacer'

export default function Footer() {
  const [session, loading] = useSession()
  const isMobile = useMobileDetector()

  const backgroundStyle = css({
    width: '100%',
    backgroundColor: 'var(--dark-gray)',
    paddingTop: '45px',
    paddingBottom: '45px',
    textAlign: isMobile ? 'center' : 'left',
  })

  const bodyStyle = css({
    maxWidth: '1280px',
    height: '100%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: isMobile ? 'center' : 'start',
    flexWrap: 'wrap',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '30px 0px',
    a: {
      color: 'var(--border-gray)',
      opacity: 0.6,
    },
    'a:hover': {
      opacity: 1,
    },
  })

  return (
    <footer css={backgroundStyle} className="footer-z">
      <div css={bodyStyle}>
        <div css={logoStyle}>
          {!loading && !session && <div>
            <PlainText size='13' color='var(--text-gray)' whiteSpace='nowrap'>君の光をさがそう。</PlainText>
            <Spacer height='15' />
            <img src="/img/logo_black.png" srcSet="/img/logo_black.png 1x, /img/logo_black@2x.png 2x" alt='TERACONNECTロゴ' />
          </div>
          }
          {!loading && session && <div>
            <PlainText size='13' color='var(--text-gray)' whiteSpace='nowrap'>あなたの知識が、誰かを照らす。</PlainText>
            <Spacer height='15' />
            <img src="/img/logo_black.png" srcSet="/img/logo_black.png 1x, /img/logo_black@2x.png 2x" alt='TERACONNECTロゴ' />
          </div>
          }
        </div>
        <FlexItem>
          <PlainText color='var(--border-gray)' size='16' fontWeight='bold' whiteSpace='nowrap'>使いかた</PlainText>
          <ContainerSpacer top='10' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <PageLink path='/search'>授業を探す</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <PageLink path='/lessons/new'>授業をつくる</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <PageLink path='/'>よくある質問</PageLink>
            </PlainText>
          </ContainerSpacer>
        </FlexItem>
        <FlexItem>
          <PlainText color='var(--border-gray)' size='16' fontWeight='bold' whiteSpace='nowrap'>サービスについて</PlainText>
          <ContainerSpacer top='10' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <PageLink path="/">TERACONNECTとは</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <PageLink path="/">ライセンス表記</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <PageLink path="/">運営者</PageLink>
            </PlainText>
          </ContainerSpacer>
        </FlexItem>
        <FlexItem>
          <PlainText color='var(--border-gray)' size='16' fontWeight='bold' whiteSpace='nowrap'>ご利用にあたって</PlainText>
          <ContainerSpacer top='10' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <PageLink path="/terms_of_use">利用規約</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' whiteSpace='nowrap'>
              <a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2">お問い合わせ</a>
            </PlainText>
          </ContainerSpacer>
        </FlexItem>
      </div>
    </footer>
  )
}

const logoStyle = css({
  display: 'flex',
  alignItems: 'center',
  height: '126px',
})