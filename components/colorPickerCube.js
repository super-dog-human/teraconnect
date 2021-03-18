/** @jsxImportSource @emotion/react */
import React, { useState, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { css } from '@emotion/core'
import InputText from './form/inputText'
import 'react-colorful/dist/index.css'

export default function ColorPickerCube({ initialColor, isBorder=false, className }) {
  const [color, setColor] = useState(initialColor)
  const positionRef = useRef({ x: 0, y: 0 })
  const [isPickerShow, setIsPickerShow] = useState(false)

  function handleClick(e) {
    console.log(e)
    positionRef.current = { x: e.nativeEvent.layerX, y: e.nativeEvent.layerY + 20 }
    setIsPickerShow(true)
  }

  function handleBackgroundClick(e) {
    if (e.target === e.currentTarget) {
      setIsPickerShow(false)
    }
  }

  function handleColorChange(color) {
    setColor(color)
  }

  function handleTextBlur(e) {
    setColor(e.target.value)
  }

  const bodyStyle = css({
    backgroundColor: isBorder ? 'white' : color,
    border: isBorder ? `5px solid ${color}` : 'none',
    padding: '0',
    borderRadius: '0',
  })

  const pickerContainerStyle = css({
    display: isPickerShow ? 'block' : 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    ['.react-colorful']: {
      width: '130px',
      height: '130px',
    }
  })

  const colorPickerStyle = css({
    position: 'relative',
    top: positionRef.current.y,
    left: positionRef.current.x,
  })

  const colorStringStyle = css({
    position: 'relative',
    top: positionRef.current.y,
    left: positionRef.current.x,
    width: '130px',
    height: '15px',
    fontSize: '15px',
    lineHeight: '15px',
    textAlign: 'center',
    border: 'none',
    backgroundColor: 'inherit',
    color: 'var(--text-gray)',
    [':focus']: {
      outline: 'none',
    },
  })

  return (
    <>
      <button css={bodyStyle} className={className} onClick={handleClick}></button>
      <div css={pickerContainerStyle} onClick={handleBackgroundClick}>
        <HexColorPicker color={color} onChange={handleColorChange} css={colorPickerStyle}/>
        <InputText css={colorStringStyle} key={color} defaultValue={color} onBlur={handleTextBlur}/>
      </div>
    </>
  )
}