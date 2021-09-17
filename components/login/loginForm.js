/** @jsxImportSource @emotion/react */
import React from 'react'
import PageLink from '../pageLink'
import { css } from '@emotion/core'

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

        <PageLink path="/sign_up">
          ユーザー登録
        </PageLink>
      </div>
    )
  }
}
