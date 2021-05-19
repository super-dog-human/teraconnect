import React from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import IconButton from '../../../../button/iconButton'
import DragHandler from '../../../../dragHandler'
import DialogFooter from '../configDialog/dialogFooter'

export default function Music(props) {
  const tabConfig = { elapsedTime: 0 }
  const isProcessing = false

  function handleClose() {
    props.closeCallback()
  }

  function handleConfirm() {

  }

  function setConfig() {

  }

  return (
    <>
      <DragHandler>
        <AlignContainer textAlign='right'>
          <Container width='36' height='36' display='inline-block'>
            <IconButton name={'close'} padding='10' onClick={handleClose} borderColor='none' disabled={isProcessing} />
          </Container>
        </AlignContainer>
      </DragHandler>
      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={tabConfig.elapsedTime} setConfig={setConfig} onConfirm={handleConfirm} onCancel={handleClose} isProcessing={isProcessing} />
        </ContainerSpacer>
      </Container>
    </>
  )
}