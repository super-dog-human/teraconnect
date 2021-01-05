/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { css } from '@emotion/core'
import { Container, Row, Col, Hidden } from 'react-grid-system'

export default function Footer() {
  const [ session, loading ] = useSession()

  return (
    <footer className="text-align-center" css={bodyStyle}>

      <div css={logoStyle}>
        {!loading && !session && <div>
          <div css={logoCopyStyle}>君の光をさがそう。</div>
          <img src="/img/logo_text.png" />
        </div>
        }

        {!loading && session && <div>
          <div css={logoCopyStyle}>あなたの知識が、誰かを照らす。</div>
          <img src="/img/logo_text.png" />
        </div>
        }
      </div>

      <Container fluid>
        <Row justify="center" css={footerMenus}>
          <Col md={3}>
            <div>
              <Link href="/">サービス概要</Link>
            </div>
            <Hidden xs sm>&nbsp;</Hidden>
            <div>
              <Link href="/">ライセンス表記</Link>
            </div>
            <Hidden xs sm>&nbsp;</Hidden>
            <div>
              <Link href="/">運営者</Link>
            </div>
          </Col>

          <Col md={3}>
            <div>
              <Link href="/">はじめ方</Link>
            </div>
            <Hidden xs sm>&nbsp;</Hidden>
            <div>
              <Link href="/">授業をさがす</Link>
            </div>
            <Hidden xs sm>&nbsp;</Hidden>
            <div>
              <Link href="/">授業をつくる</Link>
            </div>
            <Hidden xs sm>&nbsp;</Hidden>
          </Col>

          <Col md={3}>
            <div>
              <Link href="/">よくある質問</Link>
            </div>
            <Hidden xs sm>&nbsp;</Hidden>
            <div>
              <Link href="/terms_of_use">利用規約</Link>
            </div>
            <Hidden xs sm>&nbsp;</Hidden>
            <div>
              <a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2">問い合わせ</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

const bodyStyle = css({
  width: '100%',
  paddingTop: '120px',
  paddingBottom: '120px',
  justifyContent: 'center',
  backgroundColor: 'var(--dark-gray)',
  color: 'var(--text-gray)',
  a: {
    color: 'var(--text-gray)',
  },
  'a:hover': {
    opacity: 0.8,
  },
})

const logoStyle = css({
  height: '63px',
  marginBottom: '80px',
})

const logoCopyStyle = css({
  fontSize: '12px',
  marginBottom: '15px',
})

const footerMenus = css({
  div: {
    minHeight: '30px',
  }
})
