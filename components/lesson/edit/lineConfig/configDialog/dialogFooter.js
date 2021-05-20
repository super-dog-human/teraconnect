import React from 'react'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import DialogButton from './dialogButton'
import DialogElapsedTime from './dialogElapsedTime'

export default function DialogFooter({ elapsedTime, setConfig, onCancel, onConfirm, isProcessing, disabled }) {
  return (
    <Flex justifyContent='space-between' alignItems='center'>
      <DialogElapsedTime elapsedTime={elapsedTime} setConfig={setConfig} />
      <Flex justifyContent='space-between'>
        <DialogButton onClick={onCancel} disabled={isProcessing || disabled} kind="cancel" label='キャンセル' />
        <Spacer width='30' />
        <DialogButton onClick={onConfirm} isProcessing={isProcessing} disabled={disabled} kind="confirm" label='確定' />
      </Flex>
    </Flex>
  )
}