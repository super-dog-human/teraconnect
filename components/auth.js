/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useSession } from 'next-auth/client'
import LoginForm from './loginForm'

const Auth = ({ children }) => {
  const [session, isLoading] = useSession()
  const isLoggedIn = !!session?.user

  return (
    <div css={bodyStyle}>
      {!isLoading && isLoggedIn && children}
      {!isLoading && !isLoggedIn && <LoginForm />}
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

export default Auth