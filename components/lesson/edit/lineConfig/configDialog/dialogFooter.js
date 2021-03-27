import React from 'react'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import DialogButton from './dialogButton'
import DialogElapsedtime from './dialogElapsedtime'

export default function DialogFooter({ elapsedtime, onCancel, onConfirm }) {
  return (
    <Flex justifyContent='space-between' alignItems='center'>
      <DialogElapsedtime elapsedtime={elapsedtime} />
      <Flex justifyContent='space-between'>
        <DialogButton onClick={onCancel} kind="cancel" label='キャンセル' />
        <Spacer width='30' />
        <DialogButton onClick={onConfirm} kind="confirm" label='確定' />
      </Flex>
    </Flex>
  )
}