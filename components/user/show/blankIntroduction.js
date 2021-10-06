/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Aspect16To9Container from '../../aspect16To9Container'
import Container from '../../container'
import PlainText from '../../plainText'
import Spacer from '../../spacer'
import Icon from '../../icon'
import Flex from '../../flex'
import PageLink from '../../pageLink'

const BlankIntroduction = ({ isMobile, user, currentUser }) => (
  <>
    <Aspect16To9Container>
      <div css={bodyStyle}>
        {currentUser &&
            <div>
              <div>
                <PlainText color='var(--soft-white)' size='16'>
                  {user.introductionID === 0 && '自己紹介はありません。'}
                  {user.introductionID > 0 && user.id !== currentUser.id && '自己紹介はありません。'}
                  {user.introductionID > 0 && user.id === currentUser.id && '自己紹介は未公開です。'}
                </PlainText>
              </div>
              {!isMobile && user.id === currentUser.id &&
                <>
                  <Spacer height='10' />
                  <Flex justifyContent='center'>
                    <PageLink path={user.introductionID === 0 ?
                      '/lessons/new?is_introduction=true' :
                      `/lessons/${user.introductionID}/edit`}
                    >
                      <Flex alignItems='center'>
                        <Container width='16' height='16'>
                          <Icon name='edit' />
                        </Container>
                        <Spacer width='5' />
                        <PlainText color='white' size='14' lineHeight='25'>
                          {user.introductionID === 0 ? '作成' : '編集'}
                        </PlainText>
                      </Flex>
                    </PageLink>
                  </Flex>
                </>
              }
            </div>
        }
      </div>
    </Aspect16To9Container>
  </>
)

export default BlankIntroduction

const bodyStyle = css({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'gray',
})