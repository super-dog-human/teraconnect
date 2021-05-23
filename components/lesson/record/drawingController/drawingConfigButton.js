import React from 'react'
import Container from '../../../container'
import IconButton from '../../../button/iconButton'

export default function DrawingConfigButton({ name, isSelected, disabled, onClick }) {
  return (
    <Container width='28' height='28'>
      <IconButton name={name} hoverBackgroundColor='var(--text-gray)' toggledBackgroundColor='var(--back-movie-black)'
        padding='3' onClick={onClick} disabled={disabled} isToggle={isSelected} />
    </Container>
  )
}