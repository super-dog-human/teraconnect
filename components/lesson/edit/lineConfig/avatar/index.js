import React from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import IconButton from '../../../../button/iconButton'
import DragHandler from '../../../../dragHandler'
import DialogFooter from '../configDialog/dialogFooter'

export default function Avatar(props) {
  const tabConfig = { elapsedTime: 0 }
  const isProcessing = false

  function handleCancel() {
    props.closeCallback(true)
  }

  function handleConfirm() {
    props.closeCallback()
  }

  function setConfig() {

  }

  return (
    <>
      <DragHandler>
        <AlignContainer textAlign='right'>
          <Container width='36' height='36' display='inline-block'>
            <IconButton name={'close'} padding='10' onClick={handleCancel} disabled={isProcessing} />
          </Container>
        </AlignContainer>
      </DragHandler>
      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={tabConfig.elapsedTime} setConfig={setConfig} onConfirm={handleConfirm} onCancel={handleCancel} isProcessing={isProcessing} />
        </ContainerSpacer>
      </Container>
    </>
  )
}