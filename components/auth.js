/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import InputHidden from './form/inputHidden'
import LoginForm from './loginForm'

const Auth = ({ children }) => {
  const { data: session, status } = useSession()
  const isLoggedIn = !!session?.user
  const router = useRouter()

  return (
    <div css={bodyStyle}>
      <InputHidden id='csrfToken' />
      {status !== 'loading' && isLoggedIn && children}
      {status !== 'loading' && !isLoggedIn && <LoginForm isSignUp={router.query.sign_up === 'true'} />}
    </div>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

export default Auth