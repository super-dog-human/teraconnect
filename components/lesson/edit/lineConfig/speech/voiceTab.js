import React from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import IconButton from '../../../../button/iconButton'
import Spacer from '../../../../spacer'
import DialogFooter from '../configDialog/dialogFooter'

export default function VoiceTab({ config, onCancel, onConfirm }) {
  return (
    <ContainerSpacer left='50' right='50'>
      <Spacer height='10' />
      <Flex alignItems='center' justifyContent='flex-end'>
        <Container width='20' height='20'>
          <IconButton name='microphone' borderColor='var(--dark-gray)' padding='0' />
        </Container>
      </Flex>
      <DialogFooter elapsedtime={config.elapsedtime} onCancel={onCancel} onConfirm={onConfirm} />
    </ContainerSpacer>
  )
}