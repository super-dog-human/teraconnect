/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import { signIn } from 'next-auth/react'
import Flex from './flex'
import Container from './container'
import PlainText from './plainText'
import LabelButton from './button/labelButton'
import Spacer from './spacer'
import PageLink from './pageLink'

const LoginForm = ({ isSignUp }) => (
  <div css={backgroundStyle}>
    <Spacer height='50' />

    <div css={bodyStyle}>
      <Flex justifyContent='center'>
        <PlainText color='gray' size='15'>
          {isSignUp && <>
          ユーザー登録に使用するアカウントを選択してください。<br />
          連携が成功すると、ユーザー登録画面へ移動します。
          </>
          }
          {!isSignUp && 'ログインに使用するアカウントを選択してください。'}
        </PlainText>
      </Flex>

      <Spacer height='50' />

      <Flex justifyContent='center'>
        <Container width='250' height='60'>
          <LabelButton fontSize='25' lineHeight='50' color='gray' borderColor='var(--text-gray)' onClick={() => signIn('twitter')}>
            <Flex justifyContent='center' alignItems='center'>
              <img src="/img/twitter.webp" srcSet="/img/twitter.webp 1x, /img/twitter@2x.webp 2x" alt="" css={iconStyle} />
              <Spacer width='10' />
              <span>Twitter</span>
            </Flex>
          </LabelButton>
        </Container>
      </Flex>

      <Spacer height='30' />

      <Flex justifyContent='center'>
        <Container width='250' height='60'>
          <LabelButton fontSize='25' lineHeight='50' color='gray' borderColor='var(--text-gray)' onClick={() => signIn('google')}>
            <Flex justifyContent='center' alignItems='center'>
              <img src="/img/google.webp" srcSet="/img/google.webp 1x, /img/google@2x.webp 2x" alt="" css={iconStyle} />
              <Spacer width='10' />
              <span>Google</span>
            </Flex>
          </LabelButton>
        </Container>
      </Flex>

      <Spacer height='50' />

      {!isSignUp &&
      <>
        <Flex justifyContent='center'>
          <PageLink path="/about?show_navigate=true">
            <PlainText color='gray' size='15'>
              新規ユーザー登録
            </PlainText>
          </PageLink>
        </Flex>

        <Spacer height='50' />
      </>
      }
    </div>
  </div>
)

const backgroundStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--bg-light-gray)',
})

const bodyStyle = css({
  maxWidth: '1280px',
  margin: 'auto',
  height: '100%',
})

const iconStyle = css({
  width: '30px',
  height: 'auto',
  objectFit: 'contain',
})

export default LoginForm