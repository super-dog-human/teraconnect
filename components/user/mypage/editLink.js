import React from 'react'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Container from '../../container'
import Icon from '../../icon'
import Flex from '../../flex'
import PageLink from '../../pageLink'

const EditLink = () => (
  <>
    <PageLink path='/users/edit'>
      <Flex alignItems='center'>
        <Container width='18' height='18'>
          <Icon name='edit-gray' />
        </Container>
        <Spacer width='5' />
        <PlainText color='var(--text-dark-gray)' size='16' lineHeight='25'>編集</PlainText>
      </Flex>
    </PageLink>
  </>
)

export default EditLink