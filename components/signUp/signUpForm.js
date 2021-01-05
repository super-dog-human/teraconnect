/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react'
import { css } from '@emotion/core'

const bodyStyle = css({
  width: '100%',
  height: '750px'
})

const SignUpForm = () => {
  let email, password =  ''
  const handleEmail = useCallback(event => {
    email = event.target.value
  }, [])

  const handlePassword = useCallback(event => {
    password = event.target.value
  }, [])

  const handleSubmit = useCallback(event => {
    event.preventDefault()

  }, [])

  return (
    <div css={bodyStyle}>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleEmail} />
        <input type="text" onChange={handlePassword} />
        <input type="submit" />
      </form>
    </div>
  )
}

export default SignUpForm
