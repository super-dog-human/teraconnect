import React from 'react'
import Container from '../container'
import LabelButton from '../button/labelButton'

export default function DismissButton({ onClick, isProcessing, name }) {
  return (
    <Container width='100'>
      <LabelButton onClick={onClick} fontSize='15' borderColor='var(--border-gray)' color='gray' disabled={isProcessing}>
        {name  || '閉じる'}
      </LabelButton>
    </Container>
  )
}