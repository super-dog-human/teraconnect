import React from 'react'
import Container from '../../../../container'
import LabelButton from '../../../../button/labelButton'
import LoadingIndicator from '../../../../loadingIndicator'

export default function DialogButton({ label, kind, onClick, isProcessing=false, disabled=false }) {
  const color = kind === 'confirm' ? 'var(--dark-gray)' : 'white'
  const backgroundColor = kind === 'confirm' ? 'var(--soft-white)' : 'var(--dark-gray)'
  const borderColor = kind === 'confirm' ? 'var(--soft-white)' : 'var(--border-dark-gray)'

  return (
    <Container width='100' height='40'>
      <LabelButton fontSize='15' backgroundColor={backgroundColor} color={color} borderColor={borderColor} onClick={onClick} disabled={isProcessing || disabled}>
        {!isProcessing && label}
        {isProcessing && <LoadingIndicator size='30' />}
      </LabelButton>
    </Container>
  )
}