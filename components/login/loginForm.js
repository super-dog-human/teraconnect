/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { jsx, css } from '@emotion/core'

const bodyStyle = css({
  width: '100%',
  height: '750px'
})

export default class LoginForm extends React.Component {
  render() {
    return (
      <div css={bodyStyle}>
        <form>
          <input type="" />
          <input type="" />
        </form>

        <Link href="/sign_up">
          <a>ユーザー登録</a>
        </Link>
      </div>
    )
  }
}
