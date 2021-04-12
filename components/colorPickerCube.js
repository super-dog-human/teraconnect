/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { css } from '@emotion/core'
import InputText from './form/inputText'
import Container from './container'
import Spacer from './spacer'
import useUnmountRef from '../libs/hooks/useUnmountRef'
import 'react-colorful/dist/index.css'

export default function ColorPickerCube({ initialColor, isBorder=false, size=0, onChange }) {
  const [color, setColor] = useState(initialColor)
  const clickEventRef = useRef()
  const buttonRef = useRef()
  const [isPickerShow, setIsPickerShow] = useState(false)
  const unmountRef = useUnmountRef()

  function handlePickerClick(e) {
    if (isPickerShow) return

    clickEventRef.current = e.nativeEvent
    setIsPickerShow(true)
    window.addEventListener('click', handleBackgroundClick, { passive: false })
  }

  function handleBackgroundClick(e) {
    if (e === clickEventRef.current) return
    if (unmountRef.current) return // 閉じるボタンなどのクリックでコンポーネントごとunmoutされた場合

    setIsPickerShow(false)
    window.removeEventListener('click', handleBackgroundClick)
  }

  function handleColorChange(color) {
    setColor(color)
  }

  function handleTextBlur(e) {
    setColor(e.target.value)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('click', handleBackgroundClick)
    }
  }, [])

  useEffect(() => {
    onChange(color)
  }, [color])

  const buttonStyle = css({
    backgroundColor: isBorder ? 'white' : color,
    border: isBorder ? `5px solid ${color}` : 'none',
    padding: '0',
    borderRadius: '0',
    width: `${size}px`,
    height: `${size}px`,
  })

  return (
    <div>
      <button css={buttonStyle} onClick={handlePickerClick} ref={buttonRef} />
      {isPickerShow && <div css={pickerStyle} onClick={e => e.stopPropagation()}>
        <Spacer height='10' />
        <HexColorPicker color={color} onChange={handleColorChange} />
        <Container width='100' height='15'>
          <InputText size='15' borderWidth='0' color='var(--text-gray)' key={color} defaultValue={color} onBlur={handleTextBlur} />
        </Container>
      </div>}
    </div>
  )
}

const pickerStyle = css({
  position: 'absolute',
  '.react-colorful': {
    width: '100px',
    height: '100px',
  },
})