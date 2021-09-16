/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { css } from '@emotion/core'
import { Container, Row, Col } from 'react-grid-system'
import useMobileDetector from '../libs/hooks/useMobileDetector'

export default function Footer() {
  const [ session, loading ] = useSession()
  const isMobile = useMobileDetector()

  const backgroundStyle = css({
    width: '100%',
    backgroundColor: 'var(--dark-gray)',
    paddingTop: '30px',
    paddingBottom: '30px',
    textAlign: isMobile ? 'center' : 'left',
  })

  return (
    <footer className="footer-z" css={backgroundStyle}>
      <Container fluid css={bodyStyle}>
        <Row justify="center" css={rowStyle}>
          <Col md={4} css={logoContainerStyle}>
            {!loading && !session && <div>
              <div css={logoCopyStyle}>君の光をさがそう。</div>
              <img src="/img/logo_black.png" srcSet="/img/logo_black.png 1x, /img/logo_black@2x.png 2x" alt='TERACONNECTロゴ' />
            </div>
            }

            {!loading && session && <div>
              <div css={logoCopyStyle}>あなたの知識が、誰かを照らす。</div>
              <img src="/img/logo_black.png" srcSet="/img/logo_black.png 1x, /img/logo_black@2x.png 2x" alt='TERACONNECTロゴ' />
            </div>
            }
          </Col>
          <Col md={2}>
            <div css={categoryStyle}>使いかた</div>
            <div css={linkStyle}>
              <Link href="/">授業をさがす</Link>
            </div>
            <div css={linkStyle}>
              <Link href="/">授業をつくる</Link>
            </div>
            <div css={linkStyle}>
              <Link href="/">よくある質問</Link>
            </div>
          </Col>
          <Col md={2}>
            <div css={categoryStyle}>サービスについて</div>
            <div css={linkStyle}>
              <Link href="/">TERACONNECTとは</Link>
            </div>
            <div css={linkStyle}>
              <Link href="/">ライセンス表記</Link>
            </div>
            <div css={linkStyle}>
              <Link href="/">運営者</Link>
            </div>
          </Col>
          <Col md={2}>
            <div css={categoryStyle}>ご利用にあたって</div>
            <div css={linkStyle}>
              <Link href="/terms_of_use">利用規約</Link>
            </div>
            <div css={linkStyle}>
              <a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2">お問い合わせ</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

const bodyStyle = css({
  maxWidth: '1280px',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  a: {
    color: 'var(--border-gray)',
    opacity: 0.6,
  },
  'a:hover': {
    opacity: 1,
  },
})

const rowStyle = css({
  width: '100%',
})

const logoContainerStyle = css({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
})

const logoCopyStyle = css({
  color: 'var(--text-gray)',
  fontSize: '13px',
  marginBottom: '15px',
})

const categoryStyle = css({
  color: 'var(--border-gray)',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '15px',
  marginBottom: '15px',
})

const linkStyle = css({
  fontSize: '14px',
  marginTop: '5px',
  marginBottom: '5px',
})