/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { css } from '@emotion/react'
import InputText from './form/inputText'
import Container from './container'
import 'react-colorful/dist/index.css'

export default function ColorPicker({ initialColor, size, onChange, showColorCode=true }) {
  const [color, setColor] = useState(initialColor)

  function handleColorChange(color) {
    setColor(color)
  }

  function handleTextBlur(e) {
    setColor(e.target.value)
  }

  useEffect(() => {
    onChange(color)
  }, [color, onChange])

  const pickerStyle = css({
    '.react-colorful': {
      width: `${size}px`,
      height: `${size}px`,
    },
  })

  return (
    <div css={pickerStyle}>
      <HexColorPicker color={color} onChange={handleColorChange} />
      {showColorCode &&
        <Container width={size} height='30'>
          <InputText size='15' borderWidth='0' textAlign='center' color='var(--text-gray)' key={color} defaultValue={color} onBlur={handleTextBlur} />
        </Container>
      }
    </div>
  )
}