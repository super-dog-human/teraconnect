/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { signIn } from 'next-auth/client'
import PlainText from './plainText'
import LabelButton from './button/labelButton'
import PageLink from './pageLink'

const LoginForm = () => (
  <div css={bodyStyle}>
    <PlainText color='gray' size='15'>
      ログインに使用するアカウントを選択してください。
    </PlainText>
    <div>
      <LabelButton onClick={() => signIn('google')}>
        Google
      </LabelButton>
    </div>
    <div>
      <LabelButton onClick={() => signIn('twitter')}>
        twitter
      </LabelButton>
    </div>

    <PageLink path="/">
      ユーザー登録
    </PageLink>
  </div>
)

const bodyStyle = css({
})

export default LoginForm