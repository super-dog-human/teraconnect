import React from 'react'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import DialogButton from './dialogButton'
import DialogElapsedTime from './dialogElapsedTime'

export default function DialogFooter({ elapsedTime, setConfig, onCancel, onConfirm, isProcessing }) {
  return (
    <Flex justifyContent='space-between' alignItems='center'>
      <DialogElapsedTime elapsedTime={elapsedTime} setConfig={setConfig} />
      <Flex justifyContent='space-between'>
        <DialogButton onClick={onCancel} disabled={isProcessing} kind="cancel" label='キャンセル' />
        <Spacer width='30' />
        <DialogButton onClick={onConfirm} isProcessing={isProcessing} disabled={isProcessing} kind="confirm" label='確定' />
      </Flex>
    </Flex>
  )
}