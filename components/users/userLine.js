import React from 'react'
import Spacer from '../spacer'
import PlainText from '../plainText'
import Container from '../container'
import Flex from '../flex'
import FlexItem from '../flexItem'
import PageLink from '../pageLink'
import MultilineText from '../multilineText'
import UserIcon from '../userIcon'

const UserLine = ({ user }) => (
  <Flex gap='20px'>
    <FlexItem flexBasis='80px'>
      <Container width='80' height='80'>
        <PageLink path={'/users/' + user.id}>
          <UserIcon id={user.id} />
        </PageLink>
      </Container>
    </FlexItem>
    <PageLink path={'/users/' + user.id}>
      <Flex flexDirection='column'>
        <PlainText size='18' lineHeight='18' color='gray'>{user.name}</PlainText>
        <Spacer height='10' />
        <Container maxWidth='700'>
          <PlainText size='14' lineHeight='24' color='gray'>
            <MultilineText texts={user.profile} />
          </PlainText>
        </Container>
      </Flex>
    </PageLink>
  </Flex>
)

export default UserLine