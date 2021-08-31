/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { css } from '@emotion/core'
import ColorPicker from './colorPicker'
import Spacer from './spacer'
import useUnmountRef from '../libs/hooks/useUnmountRef'

export default function ColorPickerCube({ initialColor, isBorder=false, size=0, onChange }) {
  const [color, setColor] = useState(initialColor)
  const clickEventRef = useRef()
  const [isPickerShow, setIsPickerShow] = useState(false)
  const unmountRef = useUnmountRef()

  function handlePickerClick(e) {
    if (isPickerShow) return

    clickEventRef.current = e.nativeEvent
    setIsPickerShow(true)
    window.addEventListener('click', handleBackgroundClick, { passive: false })
  }

  const handleBackgroundClick = useCallback(e => {
    if (e === clickEventRef.current) return
    if (unmountRef.current) return // 閉じるボタンなどのクリックでコンポーネントごとunmoutされた場合

    setIsPickerShow(false)
    window.removeEventListener('click', handleBackgroundClick)
  }, [unmountRef])

  const handleColorChange = useCallback(color => {
    setColor(color)
    onChange(color)
  }, [onChange])

  useEffect(() => {
    return () => {
      window.removeEventListener('click', handleBackgroundClick)
    }
  }, [handleBackgroundClick])

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
      <button css={buttonStyle} onClick={handlePickerClick} />
      <Spacer height='10' />
      {isPickerShow &&
        <div css={pickerStyle} onClick={e => e.stopPropagation()} className='overay-ui-z'>
          <ColorPicker initialColor={initialColor} size='100' onChange={handleColorChange} />
        </div>
      }
    </div>
  )
}

const pickerStyle = css({
  position: 'absolute',
  backgroundColor: 'var(--dark-gray)',
  borderRadius: '5px',
  filter: 'drop-shadow(2px 2px 2px gray)',
})