import React from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import DialogHeader from '../configDialog/dialogHeader'
import DialogFooter from '../configDialog/dialogFooter'

export default function Music({ index, initialConfig, closeCallback }) {
  const tabConfig = { elapsedTime: 0 }
  const isProcessing = false

  function handleCancel() {
    closeCallback(true)
  }

  function handleConfirm() {
    closeCallback()
  }

  function dispatchConfig() {

  }

  return (
    <>
      <DialogHeader onCloseClick={handleCancel} closeButtonDisabled={isProcessing} />

      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={tabConfig.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} isProcessing={isProcessing} />
        </ContainerSpacer>
      </Container>
    </>
  )
}