/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'

export default function LessonRecordDrawing(props) {
  const drawingRef = useRef(null)
  const [canvasContext, setCanvasContext] = useState()
  const [isDrawing, setIsDrawing] = useState(false)
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
    setIsDrawing(true)

    const position = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
    setStartPosition(position)
    createNewHistory(position)
  }

  function handleMouseMove(e) {
    if (!isDrawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })
  }

  function handleMouseUp (e) {
    if (!isDrawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    cleanHistory()

    setIsDrawing(false)
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
    clearCanvas()

    drawingHistories.forEach(h => {
      if (h.clear) {
        clearCanvas()
      } else {
        canvasContext.strokeStyle = h.color
        canvasContext.lineWidth = h.lineWidth
        canvasContext.globalCompositeOperation = h.eraser ? 'destination-out': 'source-over'
        const coef = { x: canvasContext.canvas.clientWidth / h.width, y: canvasContext.canvas.clientHeight / h.height }

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
      width: canvasContext.canvas.clientWidth,
      height: canvasContext.canvas.clientHeight,
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

    drawingHistories.pop()
    setDrawingHistories(drawingHistories)

    redrawFromHistory() // これはsetStateが間に合わない可能性がある。引数で渡すなど修正要
  }

  function resetCanvasSize() {
    canvasContext.canvas.width = canvasContext.canvas.clientWidth
    canvasContext.canvas.height = canvasContext.canvas.clientHeight
    //    canvasContext.strokeStyle = props.drawingConfig.color
    //    canvasContext.lineWidth = props.drawingConfig.lineWidth

    redrawFromHistory()
  }

  function clearCanvas() {
    canvasContext.clearRect(0, 0, canvasContext.canvas.clientWidth, canvasContext.canvas.clientHeight)
    canvasContext.beginPath()
  }

  useEffect(() => {
    if (!canvasContext) {
      setCanvasContext(drawingRef.current.getContext('2d'))
    } else if (props.hasResize) {
      resetCanvasSize()
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
    <canvas css={bodyStyle} className='drawing-z' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} ref={drawingRef} />
  )
}