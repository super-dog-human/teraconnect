import React, { useState } from 'react'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import DialogButton from './dialogButton'
import DialogElapsedTime from './dialogElapsedTime'

export default function DialogFooter({ elapsedTime, dispatchConfig, onCancel, onConfirm, isProcessing, disabled }) {
  const [isCheckChangingElapsedTime, setIsCheckChangingElapsedTime] = useState(true)

  function handleElapsedTimeCheckingChange(e) {
    setIsCheckChangingElapsedTime(e.currentTarget.checked)
  }

  function handleConfirm() {
    onConfirm(isCheckChangingElapsedTime)
  }

  return (
    <Flex justifyContent='space-between' alignItems='center'>
      <DialogElapsedTime elapsedTime={elapsedTime} dispatchConfig={dispatchConfig} isCheck={isCheckChangingElapsedTime} onCheckingChange={handleElapsedTimeCheckingChange} />
      <Flex justifyContent='space-between'>
        <DialogButton onClick={onCancel} disabled={isProcessing || disabled} kind="cancel" label='キャンセル' />
        <Spacer width='30' />
        <DialogButton onClick={handleConfirm} isProcessing={isProcessing} disabled={disabled} kind="confirm" label='確定' />
      </Flex>
    </Flex>
  )
}