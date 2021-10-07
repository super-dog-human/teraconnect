/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import userUsers from '../../libs/hooks/user/useUsers'
import Spacer from '../spacer'
import PlainText from '../plainText'
import Container from '../container'
import ContainerSpacer from '../containerSpacer'
import Flex from '../flex'
import LoadingIndicator from '../loadingIndicator'
import Hr from '../hr'
import UserLine from './userLine'

export default function Users() {
  const { isLoading, hasMore, terminationRef, users } = userUsers()

  return (
    <div css={bodyStyle}>
      {isLoading && users.length === 0 &&
        <div css={loadingStyle}>
          <Container width='60' height='60'>
            <LoadingIndicator size='100' />
          </Container>
        </div>
      }

      {users.length > 0 &&
        <ContainerSpacer left='10' right='10'>
          <Spacer height='20' />

          {users.map((user, i) => <ContainerSpacer key={i} top='40' bottom='40'>
            <UserLine user={user} />
          </ContainerSpacer>)}

          {hasMore &&
            <ContainerSpacer top='80' bottom='30'>
              <Flex justifyContent='center'>
                <Container width='40' height='40'>
                  {!isLoading && <div ref={terminationRef}><LoadingIndicator size='100' /></div>}
                  {isLoading && <LoadingIndicator size='100' />}
                </Container>
              </Flex>
            </ContainerSpacer>
          }
          {!hasMore &&
            <Hr width='calc(100% - 20px)' color='var(--border-gray)' />
          }
        </ContainerSpacer>
      }

      {!isLoading && users.length === 0 &&
        <PlainText color='gray' size='15'>ユーザーはまだ存在しません。</PlainText>
      }
      <Spacer height='50' />
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  maxWidth: '800px',
  margin: 'auto',
})

const loadingStyle = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})