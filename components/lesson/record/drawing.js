/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function LessonRecordDrawing(props) {
  const drawingElement = useRef(null)
  const [canvasContext, setCanvasContext] = useState()
  const [drawing, setDrawing] = useState(false)
  const [startPosition, setStartPosition] = useState({})
  const [drawingHistories, setDrawingHistories] = useState([])

  const bodyStyle = css({
    display: props.drawingConfig.hide ? 'none': 'block',
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

  function handleMouseMove(e) {
    if (!drawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  }

  function handleMouseUp (e) {
    if (!drawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    cleanHistory()

    setDrawing(false)
  }

  function drawLine(x, y) {
    if (isSamePosition(startPosition, { x, y })) return

    canvasContext.globalCompositeOperation = props.drawingConfig.eraser ?
      'destination-out': 'source-over'
    // カーブの終点をマウスの動く前の座標に、頂点を動いた後の座標にすると滑らかな線が描画できる
    canvasContext.quadraticCurveTo(startPosition.x, startPosition.y, x, y)
    canvasContext.stroke()

    addHistory({ x, y })
  }

  function redrawFromHistory() {
    drawingHistories.forEach(h => {
      if (h.clear) {
        clearCanvas()
      } else {
        canvasContext.strokeStyle = h.color
        canvasContext.lineWidth = h.lineWidth
        canvasContext.globalCompositeOperation = h.eraser ? 'destination-out': 'source-over'
        const coef = { x: currentDrawingSize().width / h.width, y: currentDrawingSize().height / h.height }

        canvasContext.beginPath()
        h.drawings.slice(1).forEach((d, i) => {
          canvasContext.quadraticCurveTo(...calcResizePosition(coef, h.drawings[i], d))
          canvasContext.stroke()
        })
      }
    })
  }

  function calcResizePosition(coefficient, originalPosition, newPosition) {
    return [coefficient.x * originalPosition.x, coefficient.y * originalPosition.y, coefficient.x * newPosition.x, coefficient.y * newPosition.y].map(f => (
      Math.round(f)
    ))
  }

  function isSamePosition(oldPosition, newPosition) {
    return oldPosition.x === newPosition.x && oldPosition.y === newPosition.y
  }

  function createNewHistory(drawing) {
    drawingHistories.push({
      clear: false,
      width: drawingElement.current.clientWidth,
      height: drawingElement.current.clientHeight,
      color: canvasContext.strokeStyle,
      eraser: props.drawingConfig.eraser,
      lineWidth: canvasContext.lineWidth,
      drawings: [drawing],
    })
    setDrawingHistories(drawingHistories)
  }

  function cleanHistory() {
    if (drawingHistories[drawingHistories.length - 1].drawings.length === 1) {
      drawingHistories.pop()
      setDrawingHistories(drawingHistories)
    }
  }

  function addHistory(drawing) {
    drawingHistories[drawingHistories.length - 1].drawings.push(drawing)
    setDrawingHistories(drawingHistories)
  }

  function addClearHistory() {
    if (drawingHistories.length === 0) return
    drawingHistories.push({ clear: true })
  }

  function undoDrawing() {
    if (drawingHistories.length === 0) return

    //    canvasContext.save()
    clearCanvas()

    drawingHistories.pop()
    setDrawingHistories(drawingHistories)
    redrawFromHistory()

    //    canvasContext.restore()
  }

  function setCanvasSize(width, height) {
    drawingElement.current.width = width
    drawingElement.current.height = height
  }

  function setCanvasResize(width, height) {
    setCanvasSize(width, height)
    redrawFromHistory()
  }

  function clearCanvas() {
    canvasContext.save()
    canvasContext.clearRect(0, 0, drawingElement.current.width, drawingElement.current.height)
    canvasContext.restore()
  }

  function currentDrawingSize() {
    return { width: drawingElement.current.clientWidth, height: drawingElement.current.clientHeight }
  }

  useEffect(() => {
    if (!canvasContext) {
      setCanvasContext(drawingElement.current.getContext('2d'))
    } else if (props.hasResize) {
      setCanvasResize(currentDrawingSize().width, currentDrawingSize().height)
    }

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
      }
    })
  }, [props.drawingConfig, props.hasResize])

  return (
    <canvas css={bodyStyle} className='drawing-z' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} ref={drawingElement} />
  )
}