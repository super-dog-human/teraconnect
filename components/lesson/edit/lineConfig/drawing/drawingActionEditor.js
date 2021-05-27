import React from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import ActionSelector from './actionSelector'

export default function DrawingActionEditor({ initialAction, selectedAction, setSelectedAction }) {
  return (
    <ContainerSpacer left='50' right='50'>
      <Container width='500'>
        <ActionSelector initialAction={initialAction} selectedAction={selectedAction} setSelectedAction={setSelectedAction}/>
      </Container>
    </ContainerSpacer>
  )
}