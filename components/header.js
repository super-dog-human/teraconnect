/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { css } from '@emotion/core'

export default function Header() {
  const [ session, loading ] = useSession()

  return (
    <header css={headerStyle} className='header-z'>
      <div css={headerBodyStyle}>
        <Link href="/">
          <a>
            <span css={logoStyle}>
              <img
                css={logoImageStyle}
                src="/img/logo.png"
                srcSet="/img/logo.png 1x, /img/logo@2x.png 2x"
              />
            </span>
          </a>
        </Link>

        <Link href="/search">
          <div css={[linkStyle, linkHoverStyle]}>
            <span css={menuStyle}>
              <span css={largeMenuTextStyle}>教科</span>
              <span css={smallMenuTextStyle}>で</span>
              <span css={middleMenuTextStyle}>探</span>
              <span css={smallMenuTextStyle}>す</span>
            </span>
          </div>
        </Link>

        <Link href="/search">
          <div css={[linkStyle, linkHoverStyle]}>
            <span css={menuStyle}>
              <span css={largeMenuTextStyle}>人</span>
              <span css={smallMenuTextStyle}>で</span>
              <span css={middleMenuTextStyle}>探</span>
              <span css={smallMenuTextStyle}>す</span>
            </span>
          </div>
        </Link>

        <Link href="/search">
          <div css={[linkStyle, linkHoverStyle]}>
            <span css={menuStyle}>
              <span css={largeMenuTextStyle}>教科書</span>
              <span css={smallMenuTextStyle}>で</span>
              <span css={middleMenuTextStyle}>探</span>
              <span css={smallMenuTextStyle}>す</span>
            </span>
          </div>
        </Link>

        <input type="text" css={searchInputStyle} />
        <button>
          <img
            src="/img/search.png"
            srcSet="/img/search.png 1x, /img/search@2x.png 2x"
          />
        </button>
        {!loading && !session && <>
          <Link href="/login">
            <button className="dark" css={loginButtonStyle}>授業をつくる</button>
          </Link>
        </>
        }
        {!loading && session && <>
          <Link href="/dashboard">
            <button className="light" css={loginButtonStyle}>マイページ</button>
          </Link>
        </>
        }
      </div>
    </header>
  )
}

const headerStyle = css({
  width: '100%',
  backgroundColor: 'rgba(255,255,255,0.96)',
  position: 'fixed',
  top: 0,
  left: 0,
})

const headerBodyStyle = css({
  maxWidth: '1280px',
  height: '77px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const logoStyle = css({
  verticalAlign: 'middle',
  lineHeight: '77px',
  marginLeft: '20px',
  marginRight: '100px',
})

const logoImageStyle = css({
  width: '181px',
  height: '25px',
  marginLeft: '0px',
  lineHeight: '77px',
  verticalAlign: 'middle',
})

const menuStyle = css({
  lineHeight: '77px',
  verticalAlign: 'middle',
  textAlign: 'center',
  color: '#848484',
  fontWeight: 300,
  letterSpacing: '1px',
})

const largeMenuTextStyle = css({
  fontSize: '18px',
})

const middleMenuTextStyle = css({
  fontSize: '16px',
})

const smallMenuTextStyle = css({
  fontSize: '14px',
})

const linkStyle = css({
  display: 'inline-block',
  cursor: 'pointer',
  textDecoration: 'none',
})

const linkHoverStyle = css({
  width: '180px',
  textAlign: 'center',
  '::after': {
    display: 'block',
    content: '""',
    marginTop: '-12px',
    height: '1px',
  },
  ':hover::after': {
    backgroundColor: 'var(--dark-purple)',
    opacity: 0.7,
  },
})

const searchInputStyle = css({
  width: '230px',
  minHeight: '30px',
  padding: '5px',
  lineHeight: '30px',
  fontSize: '16px',
  color: 'var(--dark-gray)',
  letterSpacing: '1px',
})

const loginButtonStyle = css({
  width: '110px',
  height: '39px',
  fontSize: '15px',
  marginLeft: '30px',
  marginRight: '5px',
})