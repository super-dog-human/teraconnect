/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function LessonRecordDrawing(props) {
  const drawingElement = useRef(null)
  const [canvasContext, setCanvasContext] = useState()
  const [drawing, setDrawing] = useState(false)
  const [startPosition, setStartPosition] = useState({})
  const [hide, setHide] = useState(false)
  const [drawingHistories, setDrawingHistories] = useState([])

  const bodyStyle = css({
    display: hide ? 'none': 'block',
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    width: '100%',
    height: '100%',
  })

  function handleMouseDown(e) {
    canvasContext.beginPath()
    setDrawing(true)

    const position = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
    setStartPosition(position)
    createNewHistory(position)
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
    canvasContext.globalCompositeOperation = props.drawingConfig.eraser ?
      'destination-out': 'source-over'
    canvasContext.quadraticCurveTo(startPosition.x, startPosition.y, x, y)
    canvasContext.stroke()
    addHistory(startPosition)
  }

  function createNewHistory(drawing) {
    drawingHistories.push({
      clear: false,
      width: drawingElement.current.clientWidth,
      height: drawingElement.current.clientHeight,
      color: canvasContext.strokeStyle,
      eraser: props.drawingConfig.eraser,
      lineWidth: canvasContext.lineWidth,
      drawings: [drawing]
    })
    setDrawingHistories(drawingHistories)
  }

  function addHistory(drawing) {
    const drawings = drawingHistories[drawingHistories.length - 1].drawings
    const oldPosition = drawings[drawings.length - 1]
    if (oldPosition.x === drawing.x && oldPosition.y === drawing.y) {
      return
    }

    drawings.push(drawing)
    setDrawingHistories(drawingHistories)
  }

  function addClearHistory() {
    if (drawingHistories.length === 0) return
    drawingHistories.push({ clear: true })
  }

  function undoDrawing() {
    canvasContext.save()
    clearCanvas()

    drawingHistories.pop() // 直近の描写を捨てて最初から描き直す
    setDrawingHistories(drawingHistories)

    drawingHistories.forEach(h => {
      if (h.clear) {
        clearCanvas()
      } else {
        // setCanvasSize(h.width, h.height)
        canvasContext.strokeStyle = h.color
        canvasContext.lineWidth = h.lineWidth
        canvasContext.globalCompositeOperation = h.eraser ? 'destination-out': 'source-over'

        canvasContext.beginPath()
        h.drawings.slice(1).forEach((d, i) => {
          canvasContext.quadraticCurveTo(h.drawings[i].x, h.drawings[i].y, d.x, d.y)
          canvasContext.stroke()
        })
        canvasContext.closePath()
      }
    })
    canvasContext.restore()
  }

  function setCanvasSize(width, height) {
    drawingElement.current.width = width
    drawingElement.current.height = height
  }

  function clearCanvas() {
    canvasContext.clearRect(0, 0, drawingElement.current.width, drawingElement.current.height)
  }

  useEffect(() => {
    if (!canvasContext) {
      setCanvasSize(drawingElement.current.clientWidth, drawingElement.current.clientHeight)
      setCanvasContext(drawingElement.current.getContext('2d'))
    } else if (props.hasResize) {
      //      setCanvasSize(drawingElement.current.clientWidth, drawingElement.current.clientHeight)
    }

    if (!props.drawingConfig) return

    Object.keys(props.drawingConfig).forEach(key => {
      switch(key) {
      case 'color':
        if (canvasContext) canvasContext.strokeStyle = props.drawingConfig.color
        break
      case 'lineWidth':
        if (canvasContext) canvasContext.lineWidth = props.drawingConfig.lineWidth
        break
      case 'undo':
        undoDrawing()
        break
      case 'clear':
        addClearHistory()
        clearCanvas()
        break
      case 'hide':
        setHide(!hide)
        break
      }
    })
  }, [props.drawingConfig, props.hasResize])

  return (
    <canvas css={bodyStyle} className='drawing-z' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} ref={drawingElement}>
    </canvas>
  )
}