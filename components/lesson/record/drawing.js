/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function LessonRecordDrawing(props) {
  const drawingElement = useRef(null)
  const [canvasContext, setCanvasContext] = useState()
  const [drawing, setDrawing] = useState(false)
  const [startPosition, setStartPosition] = useState({})

  function handleMouseDown(e) {
    canvasContext.beginPath()
    setDrawing(true)
    setStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  }

  async function handleMouseMove(e) {
    if (!drawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  }

  function handleMouseUp (e) {
    if (!drawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    canvasContext.closePath()

    setDrawing(false)
  }

  function drawLine(x, y) {
    canvasContext.strokeStyle = '#ff0000'
    canvasContext.lineWidth = 5 // 5/10/20
    canvasContext.lineTo(x, y)
    canvasContext.quadraticCurveTo(startPosition.x, startPosition.y, x, y)
    canvasContext.stroke()
  }

  useEffect(() => {
    if (canvasContext === undefined) {
      drawingElement.current.width = drawingElement.current.clientWidth
      drawingElement.current.height = drawingElement.current.clientHeight
      setCanvasContext(drawingElement.current.getContext('2d'))
    }

    // canvasContext(0, 0, drawingElement.current.width, drawingElement.current.height)
    // color
    // lineHeight

    // undo
    // hide
    // erase
    // clearRect(0, 0, canvas.width, canvas.height);
  }, [props.drawing])

  return (
    <canvas css={bodyStyle} className='drawing-z' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} ref={drawingElement}>
    </canvas>
  )
}

const bodyStyle = css({
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  width: '100%',
  height: '100%',
})