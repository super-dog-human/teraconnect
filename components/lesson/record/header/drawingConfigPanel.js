/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import { HexColorInput } from 'react-colorful'
import DrawingConfigButton from './drawingConfigButton'
import 'react-colorful/dist/index.css'

export default function DrawingConfigPanel({ disabled, color, setColor, setLineWidth, setEnablePen }) {
  const [showDrawingConfig, setShowDrawingConfig] = useState(false)
  const [panelPosition, setPanelposition] = useState({ top: 0, left: 0 })

  function handleShowPanel(e) {
    setPanelposition({ top: e.nativeEvent.pageY + 20, left: e.nativeEvent.pageX - 30 })
    setShowDrawingConfig(!showDrawingConfig)
  }

  function handleEraser() {
    setColor('eraser')
    setEnablePen(true)
  }

  function handleColorChange(e) {
    const color = (typeof e === 'string') ? e : e.target.dataset.color
    setColor(color)
    setEnablePen(true)
  }

  function handleWidthChange(e) {
    setLineWidth(e.target.dataset.width)
    setEnablePen(true)
  }

  const backgroundStyle = css({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: showDrawingConfig ? 'block' : 'none'
  })

  const contextMenuStyle = css({
    borderRadius: '10px',
    filter: 'drop-shadow(2px 2px 2px gray)',
    position: 'absolute',
    top: panelPosition.top,
    left: panelPosition.left,
    width: '150px',
    height: '250px',
    backgroundColor: 'gray'
  })

  return (
    <>
      <DrawingConfigButton css={sortDownButtonStyle} onMouseDown={handleShowPanel} disabled={disabled}>
        <img src="/img/icon/sort-down.svg" />
      </DrawingConfigButton>
      <div css={backgroundStyle} onClick={handleShowPanel}>
        <div css={contextMenuStyle}>
          <button onClick={handleWidthChange} data-width="5">細</button>
          <button onClick={handleWidthChange} data-width="10">中</button>
          <button onClick={handleWidthChange} data-width="20">太</button>

          <button onClick={handleEraser}>Eraser</button>
          <button onClick={handleColorChange} data-color="#ff0000">red</button>
          <button onClick={handleColorChange} data-color="#00ff00">green</button>
          <button onClick={handleColorChange} data-color="#000000">black</button>
          <HexColorInput color={color} onChange={handleColorChange} />
        </div>
      </div>
    </>
  )
}

const sortDownButtonStyle = css({
  paddingLeft: '3px',
  height: '38px',
  ['img']: {
    width: '8px',
  },
})