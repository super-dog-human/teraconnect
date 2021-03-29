import React from 'react'
import Container from '../../../../container'
import LabelButton from '../../../../button/labelButton'

export default function DialogButton({ label, kind, onClick }) {
  const color = kind === 'confirm' ? 'var(--dark-gray)' : 'white'
  const backgroundColor = kind === 'confirm' ? 'white' : 'var(--dark-gray)'
  const borderColor = kind === 'confirm' ? 'inherit' : 'var(--text-gray)'

  return (
    <Container width='100' height='40'>
      <LabelButton size='15' backgroundColor={backgroundColor} color={color} borderColor={borderColor} onClick={onClick}>
        {label}
      </LabelButton>
    </Container>
  )
}