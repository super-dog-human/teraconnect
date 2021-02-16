import { useRef, useState, useEffect } from 'react'
import { useLessonRecorderContext } from '../../contexts/lessonRecorderContext'
import { switchSwipable, mouseOrTouchPositions } from '../../utils'

let canvasCtx
let startPosition = {}
let startDrawingTime
let isDrawing = false
let isCleared = true
const histories = []

export default function useLessonDrawing(hasResize, startDragging, inDragging, endDragging) {
  const drawingRef = useRef(null)
  const [isDrawingHide, setIsDrawingHide] = useState(false)
  const [enablePen, setEnablePen] = useState(false)
  const [color, setColor] = useState('#ff0000')
  const [lineWidth, setLineWidth] = useState(5)
  const { setRecord } = useLessonRecorderContext()

  function resetCanvasSize() {
    canvasCtx.canvas.width = canvasCtx.canvas.clientWidth
    canvasCtx.canvas.height = canvasCtx.canvas.clientHeight

    redrawFromHistory()
  }

  function startDrawing(e) {
    if (enablePen  && !isDrawingHide) {
      switchSwipable(false)
      isCleared = false
      startDrawingTime = new Date()

      const [x, y] = mouseOrTouchPositions(e, ['touchstart'])
      drawEdgeCircle(x, y)

      canvasCtx.beginPath()
      isDrawing = true

      startPosition = { x, y }
      createNewHistory()
    } else {
      startDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function inDrawing(e) {
    if (enablePen  && !isDrawingHide) {
      if (!isDrawing) return

      const [x, y] = mouseOrTouchPositions(e, ['touchmove'])
      drawLine(x, y)
      startPosition = { x, y }
    } else {
      inDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function endDrawing(e) {
    if (enablePen  && !isDrawingHide) {
      if (!isDrawing) return
      switchSwipable(true)

      const [x, y] = mouseOrTouchPositions(e, ['touchend', 'touchcancel'])
      drawLine(x, y)
      drawEdgeCircle(x, y)

      setRecord({
        kind: 'drawing',
        action: 'draw',
        duration: new Date() - startDrawingTime,
        value: histories[histories.length - 1],
      })

      isDrawing = false
    } else {
      endDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function drawEdgeCircle(x, y) {
    canvasCtx.beginPath()
    canvasCtx.arc(x, y, canvasCtx.lineWidth / 2, 0, Math.PI * 2)
    canvasCtx.fillStyle = color
    canvasCtx.fill()
    canvasCtx.closePath()
  }

  function drawLine(x, y) {
    if (isSamePosition(startPosition, { x, y })) return

    canvasCtx.globalCompositeOperation = isEraser() ? 'destination-out': 'source-over'
    // カーブの終点をマウスの動く前の座標に、頂点を動いた後の座標にすると滑らかな線が描画できる
    canvasCtx.quadraticCurveTo(startPosition.x, startPosition.y, x, y)
    canvasCtx.stroke()

    addHistory({ x, y })
  }

  function redrawFromHistory() {
    clearCanvas()

    histories.forEach(h => {
      if (h.clear) {
        clearCanvas()
      } else {
        canvasCtx.strokeStyle = h.color
        canvasCtx.lineWidth = h.lineWidth
        canvasCtx.globalCompositeOperation = h.eraser ? 'destination-out': 'source-over'
        const coef = { x: canvasCtx.canvas.clientWidth / h.width, y: canvasCtx.canvas.clientHeight / h.height }

        const circlePositions = calcResizePosition(coef, h.drawings[0], h.drawings[h.drawings.length - 1])
        drawEdgeCircle(circlePositions[0], circlePositions[1])

        canvasCtx.beginPath()
        h.drawings.slice(1).forEach((d, i) => {
          canvasCtx.quadraticCurveTo(...calcResizePosition(coef, h.drawings[i], d))
          canvasCtx.stroke()
        })

        drawEdgeCircle(circlePositions[2], circlePositions[3])
      }
    })

    canvasCtx.strokeStyle = color
    canvasCtx.lineWidth = lineWidth
  }

  function clearCanvas() {
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.clientWidth, canvasCtx.canvas.clientHeight)
  }

  function calcResizePosition(coefficient, fromPosition, toPosition) {
    return [coefficient.x * fromPosition.x, coefficient.y * fromPosition.y, coefficient.x * toPosition.x, coefficient.y * toPosition.y].map(f => (
      Math.round(f)
    ))
  }

  function isSamePosition(oldPosition, newPosition) {
    return oldPosition.x === newPosition.x && oldPosition.y === newPosition.y
  }

  function createNewHistory() {
    histories.push({
      clear: false,
      width: canvasCtx.canvas.clientWidth,
      height: canvasCtx.canvas.clientHeight,
      color: color,
      eraser: isEraser(),
      lineWidth: lineWidth,
      drawings: [startPosition],
    })
  }

  function addHistory(drawing) {
    histories[histories.length - 1].drawings.push(drawing)
  }

  function addClearHistory() {
    if (histories.length === 0) return
    histories.push({ clear: true })
  }

  function undoDrawing() {
    if (histories.length === 0) return

    histories.pop()
    redrawFromHistory()
    setRecord({ kind: 'drawing', action: 'undo' })
    isCleared = false
  }

  function clearDrawing() {
    if (isCleared) return

    addClearHistory()
    clearCanvas()
    setRecord({ kind: 'drawing', action: 'clear' })
    isCleared = true
  }

  function isEraser() {
    return color === 'eraser'
  }

  function hideDrawing(isHide) {
    setRecord({ kind: 'drawing', action: isHide ? 'hide': 'show' })
    setIsDrawingHide(isHide)
  }

  useEffect(() => {
    canvasCtx = drawingRef.current.getContext('2d')
  }, [])

  useEffect(() => {
    if (!hasResize) return
    resetCanvasSize()
  }, [hasResize])

  useEffect(() => {
    if (isEraser()) {
      canvasCtx.globalCompositeOperation = 'destination-out'
    } else {
      canvasCtx.globalCompositeOperation = 'source-over'
      canvasCtx.strokeStyle = color
    }
  }, [color])

  useEffect(() => {
    canvasCtx.lineWidth = lineWidth
  }, [lineWidth])

  return {
    isDrawingHide, setIsDrawingHide: hideDrawing, enablePen, setEnablePen, undoDrawing, clearDrawing,
    drawingColor: color, setDrawingColor: setColor, setDrawingLineWidth: setLineWidth,
    startDrawing, inDrawing, endDrawing, drawingRef
  }
}