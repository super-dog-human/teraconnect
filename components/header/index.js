/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { css } from '@emotion/core'
import Flex from '../flex'
import LabelLink from './labelLink'
import SearchBox from './searchBox'
import AlgoliaSearchBox from './algoliaSearchBox'

export default function Header() {
  const [ session, loading ] = useSession()
  const router = useRouter()

  return (
    <header css={headerStyle} className="header -z">
      <div css={headerBodyStyle}>
        <Flex justifyContent='space-between' alignItems='center'>
          <Link href="/" passHref>
            <a>
              <span css={logoStyle}>
                <img
                  css={logoImageStyle}
                  src="/img/logo.png"
                  srcSet="/img/logo.png 1x, /img/logo@2x.png 2x"
                  alt='サービスロゴ'
                />
              </span>
            </a>
          </Link>

          <LabelLink target='/categories' label='教科で探す' />
          <LabelLink target='/users' label='人で探す' />

          {router.pathname === '/search' ? <AlgoliaSearchBox /> : <SearchBox />}

          {!loading && !session &&
            <>
              <Link href="/login" passHref>
                <a>
                  <button className="dark" css={loginButtonStyle}>授業をつくる</button>
                </a>
              </Link>
            </>
          }
          {!loading && session &&
            <>
              <Link href="/dashboard" passHref>
                <a>
                  <button className="light" css={loginButtonStyle}>マイページ</button>
                </a>
              </Link>
            </>
          }
        </Flex>
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
  height: '60px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const logoStyle = css({
  verticalAlign: 'middle',
  lineHeight: '60px',
  marginLeft: '20px',
  marginRight: '100px',
})

const logoImageStyle = css({
  width: '181px',
  height: '25px',
  marginLeft: '0px',
  lineHeight: '60px',
  verticalAlign: 'middle',
})

const loginButtonStyle = css({
  width: '110px',
  height: '39px',
  fontSize: '15px',
  marginLeft: '30px',
  marginRight: '5px',
})