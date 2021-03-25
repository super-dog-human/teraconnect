import React from 'react'
import ContainerSpacer from '../../../containerSpacer'
import Spacer from '../../../spacer'
import Flex from '../../../flex'
import InputText from '../../../form/inputText'
import DialogButton from './dialogButton'

export default function DialogFooter({ elapsedtime, onCancel, onConfirm }) {
  return (
    <ContainerSpacer top='50'>
      <Flex justifyContent='space-between' alignItems='center'>
        <InputText defaultValue={elapsedtime} size='15' color='var(--soft-white)' borderWidth='0' maxLength='9' />
        <Flex justifyContent='space-between'>
          <DialogButton onClick={onCancel} kind="cancel" label='キャンセル' />
          <Spacer width='30' />
          <DialogButton onClick={onConfirm} kind="confirm" label='確定' />
        </Flex>
      </Flex>
    </ContainerSpacer>
  )
}