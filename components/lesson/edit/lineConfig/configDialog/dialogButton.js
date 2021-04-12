import React from 'react'
import Container from '../../../../container'
import LabelButton from '../../../../button/labelButton'
import LoadingIndicator from '../../../../loadingIndicator'

export default function DialogButton({ label, kind, onClick, isProcessing=false }) {
  const color = kind === 'confirm' ? 'var(--dark-gray)' : 'white'
  const backgroundColor = kind === 'confirm' ? 'white' : 'var(--dark-gray)'
  const borderColor = kind === 'confirm' ? 'inherit' : 'var(--border-dark-gray)'

  return (
    <Container width='100' height='40'>
      <LabelButton size='15' backgroundColor={backgroundColor} color={color} borderColor={borderColor} onClick={onClick} disabled={isProcessing}>
        {!isProcessing && label}
        {isProcessing && <LoadingIndicator size='80' />}
      </LabelButton>
    </Container>
  )
}