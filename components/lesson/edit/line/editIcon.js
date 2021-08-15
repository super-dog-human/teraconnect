import React from 'react'
import Flex from '../../../flex'
import ContainerSpacer from '../../../containerSpacer'
import Container from '../../../container'
import IconButton from '../../../button/iconButton'
import LoadingIndicator from '../../../loadingIndicator'

export default function EditIcon({ onClick, isShow, isProcessing }) {
  return (
    <Flex justifyContent='center' alignItems='center'>
      <ContainerSpacer left='15'>
        <Container width='25'>
          <Container width='22' height='22' invisible={!isShow}>
            { isProcessing ? <LoadingIndicator size='80' /> : <IconButton name='more' onMouseDown={onClick} /> }
          </Container>
        </Container>
      </ContainerSpacer>
    </Flex>
  )
}