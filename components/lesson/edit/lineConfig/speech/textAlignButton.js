/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import CubeButton from '../../../../cubeButton'
import { css } from '@emotion/core'

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
  }, [value])

  const buttonStyle = css({
    backgroundColor: isSelected ? 'var(--text-gray)' : 'inherit',
    width: '28px',
    height: '28px',
    padding: '5px',
    [':hover']: {
      opacity: '0.3',
    },
  })

  return (
    <CubeButton icon={`align-${align}`} onClick={handleClick} css={buttonStyle} />
  )
}