/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ColorFilter from '../../colorFilter'
import Spacer from '../../spacer'
import UserIcon from '../../userIcon'
import PlainText from '../../plainText'
import Container from '../../container'
import FlexItem from '../../flexItem'

export default function HeaderImage({ url, user, isMobile }) {
  const backgroundStyle = css({
    width: '100%',
    height: '250px',
    backgroundColor: 'var(--dark-blue)',
    backgroundImage: `url(${url})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPositionX: 'center',
    backgroundPositionY: '55%',
    top: 60,
  })

  return (
    <div css={backgroundStyle}>
      <div css={bodyStyle}>
        <FlexItem flexBasis='70px'>
          <Container width='70' height='70'>
            <UserIcon id={user.id} />
          </Container>
        </FlexItem>
        <Spacer width='10' />
        <PlainText size={isMobile ? '20' : '35'} color='white' fontWeight='bold'>
          <ColorFilter filter='drop-shadow(5px 5px 5px black)'>
            {user.name}
          </ColorFilter>
        </PlainText>
      </div>
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  marginLeft: '10px',
  marginRight: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})