/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import InputHidden from './form/inputHidden'
import Container from './container'
import TopLogoLink from './topLogoLink'
import LoginForm from './loginForm'
import Footer from './footer'

const LayoutWithAuth = ({ children }) => {
  const { data: session, status } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <>
      {status !== 'loading' && isLoggedIn &&
        <>
          <InputHidden id='csrfToken' />
          {children}
          <Footer />
        </>
      }
      {status !== 'loading' && !isLoggedIn &&
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