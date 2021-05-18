import React from 'react'
import Container from '../container'
import LabelButton from '../button/labelButton'
import LoadingIndicator from '../loadingIndicator'

export default function ConfirmButton({ onClick, isProcessing, name }) {
  return (
    <Container width='100'>
      <LabelButton onClick={onClick} fontSize='15' backgroundColor='var(--dark-gray)' color='var(--soft-white)' disabled={isProcessing}>
        {isProcessing ? <LoadingIndicator size='30' /> : name || '実行'}
      </LabelButton>
    </Container>
  )
}