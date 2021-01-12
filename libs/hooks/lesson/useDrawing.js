import { useRef, useState, useEffect } from 'react'

let canvasContext
let startPosition = {}
let isDrawing = false
const histories = []

export default function useLessonDrawing(setRecord, hasResize) {
  const drawingRef = useRef(null)
  const [color, setColor] = useState('#ff0000')
  const [lineWidth, setLineWidth] = useState(5)

  function resetCanvasSize() {
    canvasContext.canvas.width = canvasContext.canvas.clientWidth
    canvasContext.canvas.height = canvasContext.canvas.clientHeight

    redrawFromHistory()
  }

  function startDrawing(e) {
    canvasContext.beginPath()
    isDrawing = true

    const position = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
    startPosition = position
    createNewHistory()
  }

  function inDrawing(e) {
    if (!isDrawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    startPosition = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
  }

  function endDrawing(e) {
    if (!isDrawing) return

    drawLine(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    cleanHistory()

    isDrawing = false
  }

  function drawLine(x, y) {
    if (isSamePosition(startPosition, { x, y })) return

    canvasContext.globalCompositeOperation = isEraser() ? 'destination-out': 'source-over'
    // カーブの終点をマウスの動く前の座標に、頂点を動いた後の座標にすると滑らかな線が描画できる
    canvasContext.quadraticCurveTo(startPosition.x, startPosition.y, x, y)
    canvasContext.stroke()

    addHistory({ x, y })
  }

  function redrawFromHistory() {
    clearCanvas()

    histories.forEach(h => {
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

    canvasContext.strokeStyle = color
    canvasContext.lineWidth = lineWidth
  }

  function clearCanvas() {
    canvasContext.clearRect(0, 0, canvasContext.canvas.clientWidth, canvasContext.canvas.clientHeight)
  }

  function calcResizePosition(coefficient, originalPosition, newPosition) {
    return [coefficient.x * originalPosition.x, coefficient.y * originalPosition.y, coefficient.x * newPosition.x, coefficient.y * newPosition.y].map(f => (
      Math.round(f)
    ))
  }

  function isSamePosition(oldPosition, newPosition) {
    return oldPosition.x === newPosition.x && oldPosition.y === newPosition.y
  }

  function createNewHistory() {
    histories.push({
      clear: false,
      width: canvasContext.canvas.clientWidth,
      height: canvasContext.canvas.clientHeight,
      color: color,
      eraser: isEraser(),
      lineWidth: lineWidth,
      drawings: [startPosition],
    })
    // setRecord
  }

  function cleanHistory() {
    if (histories[histories.length - 1].drawings.length === 1) {
      histories.pop()
    }
    // setRecord
  }

  function addHistory(drawing) {
    histories[histories.length - 1].drawings.push(drawing)
    // setRecord
  }

  function addClearHistory() {
    if (histories.length === 0) return
    histories.push({ clear: true })
    // setRecord
  }

  function undoDrawing() {
    if (histories.length === 0) return

    histories.pop()
    redrawFromHistory()
    // setRecord
  }

  function clearDrawing() {
    addClearHistory()
    clearCanvas()
  }

  function isEraser() {
    return color === 'eraser'
  }

  useEffect(() => {
    canvasContext = drawingRef.current.getContext('2d')
  }, [])

  useEffect(() => {
    if (!hasResize) return
    resetCanvasSize()
  }, [hasResize])

  useEffect(() => {
    if (isEraser()) {
      canvasContext.globalCompositeOperation = 'destination-out'
    } else {
      canvasContext.globalCompositeOperation = 'source-over'
      canvasContext.strokeStyle = color
    }
  }, [color])

  useEffect(() => {
    canvasContext.lineWidth = lineWidth
  }, [lineWidth])

  return {
    undoDrawing, clearDrawing, drawingColor: color, setDrawingColor: setColor,
    drawingLineWidth: lineWidth, setDrawingLineWidth: setLineWidth, startDrawing, inDrawing, endDrawing, drawingRef
  }
}