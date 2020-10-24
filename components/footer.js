/** @jsx jsx */
import React from 'react'
import Link from 'next/link'
import { jsx, css } from '@emotion/core'

const Footer = () => (
  <footer className="text-align-center" css={bodyStyle}>
    <div>
      <div css={logoCopyStyle}>あなたの知識が、誰かを照らす。</div>
      <img src="../img/logo_text.png" />
    </div>

    <div className="flex" css={footerMenus}>
      <div>
        <div>
          <Link href="/">サービス概要</Link>
        </div>
        <div>
          <Link href="/">ライセンス表記</Link>
        </div>
        <div>
          <Link href="/">運営者</Link>
        </div>
      </div>

      <div>
        <div>
          <Link href="/">はじめ方</Link>
        </div>
        <div>
          <Link href="/">授業をさがす</Link>
        </div>
        <div>
          <Link href="/">授業をつくる</Link>
        </div>
      </div>

      <div>
        <div>
          <Link href="/">よくある質問</Link>
        </div>
        <div>
          <Link href="/terms_of_use">利用規約</Link>
        </div>
        <div>
          <a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2">問い合わせ</a>
        </div>
      </div>
    </div>
  </footer>
)

const bodyStyle = css({
  width: '100%',
  height: '350px',
  paddingTop: '120px',
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
const logoCopyStyle = css({
  fontSize: '12px',
  marginBottom: '15px',
})

const footerMenus = css({
  justifyContent: 'center',
  a: {
    margin: '200px',
  },
})

export default Footer
