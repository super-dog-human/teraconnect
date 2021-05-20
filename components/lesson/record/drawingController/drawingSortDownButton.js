import React from 'react'
import Container from '../../../container'
import IconButton from '../../../button/iconButton'

export default function DrawingSortDownButton({ disabled, onMouseDown }) {
  return (
    <Container width='13' height='28'>
      <IconButton name='sort-down' padding='0px 0px 0px 3' disabled={disabled} onMouseDown={onMouseDown} />
    </Container>
  )
}