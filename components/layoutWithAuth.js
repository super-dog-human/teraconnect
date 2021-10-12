/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useSession } from 'next-auth/client'
import Container from './container'
import TopLogoLink from './topLogoLink'
import LoginForm from './loginForm'
import Footer from './footer'

const LayoutWithAuth = ({ children }) => {
  const [session, isLoading] = useSession()
  const isLoggedIn = !!session?.user

  return (
    <>
      {!isLoading && isLoggedIn &&
        <>
          {children}
          <Footer />
        </>
      }
      {!isLoading && !isLoggedIn &&
        <div css={bodyStyle}>
          <header css={headerStyle}>
            <Container width='181'>
              <TopLogoLink color="white" />
            </Container>
          </header>
          <LoginForm />
          <Footer />
        </div>
      }
    </>
  )
}

const bodyStyle = css({
  width: '100%',
  minHeight: '100vh',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const headerStyle = css({
  backgroundColor: 'var(--dark-gray)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '60px',
})

export default LayoutWithAuth