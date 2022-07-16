/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useSession } from 'next-auth/react'
import InputHidden from './form/inputHidden'
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
          <InputHidden id='csrfToken' />
          {children}
          <Footer />
        </>
      }
      {!isLoading && !isLoggedIn &&
      <>
        <header css={headerStyle}>
          <Container width='181'>
            <TopLogoLink color="white" />
          </Container>
        </header>
        <main>
          <LoginForm />
        </main>
        <Footer />
      </>
      }
    </>
  )
}

const headerStyle = css({
  backgroundColor: 'var(--dark-gray)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '60px',
})

export default LayoutWithAuth