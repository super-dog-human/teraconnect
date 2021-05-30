import React, { useRef } from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import Spacer from '../../../../spacer'
import DialogHeader from '../configDialog/dialogHeader'
import DialogFooter from '../configDialog/dialogFooter'
import DrawingEditor from './drawingEditor'
import DrawingActionEditor from './drawingActionEditor'
import useDrawingConfig from '../../../../../libs/hooks/lesson/edit/useDrawingConfig'

export default function Drawing({ index, initialConfig, closeCallback }) {
  const { config, dispatchConfig, selectedAction, setSelectedAction, startElapsedTimeRef, previewDrawings, setPreviewDrawings, isRecording, setIsRecording, handleConfirm, handleCancel } = useDrawingConfig({ index, initialConfig, closeCallback })
  const initialActionRef = useRef(selectedAction)

  return (
    <>
      <DialogHeader onCloseClick={handleCancel} closeButtonDisabled={isRecording} />

      {initialActionRef.current === 'draw' &&
        <DrawingEditor config={config} selectedAction={selectedAction} setSelectedAction={setSelectedAction} startElapsedTime={startElapsedTimeRef.current} sameTimeIndex={index}
          isRecording={isRecording} setIsRecording={setIsRecording} drawings={previewDrawings} setDrawings={setPreviewDrawings} />
      }
      {initialActionRef.current !== 'draw' &&
        <DrawingActionEditor initialAction={initialActionRef.current} selectedAction={selectedAction} setSelectedAction={setSelectedAction} />
      }
      <Spacer height='30' />

      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={initialConfig.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} disabled={isRecording} />
        </ContainerSpacer>
      </Container>
    </>
  )
}