import React from 'react'
import DragHandler from '../../../../dragHandler'
import Container from '../../../../container'
import AlignContainer from '../../../../alignContainer'
import IconButton from '../../../../button/iconButton'


export default function DialogHeader({ onCloseClick, closeButtonDisabled }) {
  return (
    <DragHandler>
      <AlignContainer textAlign='right'>
        <Container width='36' height='36' display='inline-block'>
          <IconButton name={'close'} padding='10' onClick={onCloseClick} disabled={closeButtonDisabled} />
        </Container>
      </AlignContainer>
    </DragHandler>
  )
}