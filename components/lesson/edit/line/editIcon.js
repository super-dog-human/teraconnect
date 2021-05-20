import React from 'react'
import Flex from '../../../flex'
import ContainerSpacer from '../../../containerSpacer'
import Container from '../../../container'
import IconButton from '../../../button/iconButton'

export default function EditIcon({ onClick, isShow }) {
  return (
    <Flex justifyContent='center' alignItems='center'>
      <ContainerSpacer left='15'>
        <Container width='25'>
          <Container width='22' height='22' invisible={!isShow}>
            <IconButton name='more' onClick={onClick} />
          </Container>
        </Container>
      </ContainerSpacer>
    </Flex>
  )
}