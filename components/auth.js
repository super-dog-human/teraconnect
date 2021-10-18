/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import InputHidden from './form/inputHidden'
import LoginForm from './loginForm'

const Auth = ({ children }) => {
  const [session, isLoading] = useSession()
  const isLoggedIn = !!session?.user
  const router = useRouter()

  return (
    <div css={bodyStyle}>
      <InputHidden id='csrfToken' />
      {!isLoading && isLoggedIn && children}
      {!isLoading && !isLoggedIn && <LoginForm isSignUp={router.query.sign_up === 'true'} />}
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

export default Auth