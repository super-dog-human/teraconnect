import React, { useState, useEffect } from 'react'
import Container from '../../../../container'
import IconButton from '../../../../button/iconButton'

export default function TextAlignButton({ align, value, onClick }) {
  const [isSelected, setIsSelected] = useState()

  function handleClick() {
    onClick(align)
  }

  useEffect(() => {
    if (align === value) {
      setIsSelected(true)
    } else if (!value && (align === 'center' || align === 'bottom')) {
      setIsSelected(true)
    } else {
      setIsSelected(false)
    }
  }, [align, value])

  return (
    <Container width='28' height='28'>
      <IconButton name={`align-${align}`} backgroundColor={isSelected ? 'var(--text-gray)' : 'var(--dark-gray)'} toggledBackgroundColor={'var(--text-gray)'} isToggle={isSelected} padding='5' onClick={handleClick} />
    </Container>
  )
}