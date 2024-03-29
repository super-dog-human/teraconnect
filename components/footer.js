/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import useMobileDetector from '../libs/hooks/useMobileDetector'
import Flex from './flex'
import FlexItem from './flexItem'
import PlainText from './plainText'
import PageLink from './pageLink'
import Spacer from './spacer'
import ContainerSpacer from './containerSpacer'

export default function Footer() {
  const { data: session, status } = useSession()
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
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '30px 0px',
    a: {
      color: 'var(--border-gray)',
      opacity: 0.9,
    },
    'a:hover': {
      opacity: 1,
    },
  })

  return (
    <footer css={backgroundStyle} className="footer-z">
      <div css={bodyStyle}>
        <div css={logoStyle}>
          {status !== 'loading' && !session && <div>
            <Flex justifyContent='center'>
              <PlainText size='13' color='var(--text-gray)' whiteSpace='nowrap'>君の光をさがそう。</PlainText>
            </Flex>
            <Spacer height='15' />
            <PageLink path='/'>
              <img src="/img/logo_black.png" srcSet="/img/logo_black.png 1x, /img/logo_black@2x.png 2x" width="181" height="25" alt='TERACONNECTロゴ' />
            </PageLink>
          </div>
          }
          {status !== 'loading' && session && <div>
            <PlainText size='13' color='var(--text-gray)' whiteSpace='nowrap'>あなたの知識が、誰かを照らす。</PlainText>
            <Spacer height='15' />
            <PageLink path='/'>
              <img src="/img/logo_black.png" srcSet="/img/logo_black.png 1x, /img/logo_black@2x.png 2x" width="181" height="25" alt='TERACONNECTロゴ' />
            </PageLink>
          </div>
          }
        </div>
        <FlexItem>
          <PlainText color='var(--border-gray)' size='16' fontWeight='bold' whiteSpace='nowrap'>サービスについて</PlainText>
          <ContainerSpacer top='10' bottom='5'>
            <PlainText size='14' lineHeight='25' whiteSpace='nowrap'>
              <PageLink path="/about">TERACONNECTとは</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' lineHeight='25' whiteSpace='nowrap'>
              <PageLink path="/licenses">ライセンス表記</PageLink>
            </PlainText>
          </ContainerSpacer>
        </FlexItem>
        <FlexItem>
          <PlainText color='var(--border-gray)' size='16' fontWeight='bold' whiteSpace='nowrap'>使いかた</PlainText>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' lineHeight='25' whiteSpace='nowrap'>
              <PageLink path='/how_to_record'>授業の収録</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' lineHeight='25' whiteSpace='nowrap'>
              <PageLink path='/how_to_edit'>授業の編集</PageLink>
            </PlainText>
          </ContainerSpacer>
        </FlexItem>
        <FlexItem>
          <PlainText color='var(--border-gray)' size='16' fontWeight='bold' whiteSpace='nowrap'>ご利用にあたって</PlainText>
          <ContainerSpacer top='10' bottom='5'>
            <PlainText size='14' lineHeight='25' whiteSpace='nowrap'>
              <PageLink path="/terms_of_use">利用規約</PageLink>
            </PlainText>
          </ContainerSpacer>
          <ContainerSpacer top='5' bottom='5'>
            <PlainText size='14' lineHeight='25' whiteSpace='nowrap'>
              <a href="https://forms.gle/xJxc7spEDEDxLBRY6">お問い合わせ</a>
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