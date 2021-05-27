import React, { useRef } from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import Spacer from '../../../../spacer'
import IconButton from '../../../../button/iconButton'
import DragHandler from '../../../../dragHandler'
import DialogFooter from '../configDialog/dialogFooter'
import DrawingEditor from './drawingEditor'
import DrawingActionEditor from './drawingActionEditor'
import useDrawingConfig from '../../../../../libs/hooks/lesson/edit/useDrawingConfig'

export default function Drawing({ index, initialConfig, closeCallback }) {
  const { config, setConfig, selectedAction, setSelectedAction, startElapsedTimeRef, previewDrawings, setPreviewDrawings, isRecording, setIsRecording, handleConfirm } = useDrawingConfig({ index, initialConfig, closeCallback })
  const initialActionRef = useRef(selectedAction)

  return (
    <>
      <DragHandler>
        <AlignContainer textAlign='right'>
          <Container width='36' height='36' display='inline-block'>
            <IconButton name={'close'} padding='10' onClick={closeCallback} disabled={isRecording} />
          </Container>
        </AlignContainer>
      </DragHandler>

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
          <DialogFooter elapsedTime={initialConfig.elapsedTime} setConfig={setConfig} onConfirm={handleConfirm} onCancel={closeCallback} disabled={isRecording} />
        </ContainerSpacer>
      </Container>
    </>
  )
}