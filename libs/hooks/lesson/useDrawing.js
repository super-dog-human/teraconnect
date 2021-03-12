import { useRef, useState, useEffect } from 'react'
import { useLessonRecorderContext } from '../../contexts/lessonRecorderContext'
import { switchSwipable, mouseOrTouchPositions } from '../../utils'

const histories = []

export default function useLessonDrawing(hasResize, startDragging, inDragging, endDragging) {
  const canvasCtxRef = useRef()
  const isMobileDeviceRef = useRef()
  const startPositionRef = useRef({})
  const startDrawingTimeRef = useRef()
  const isDrawingRef = useRef(false)
  const isClearedRef = useRef(true)
  const drawingRef = useRef()
  const [isDrawingHide, setIsDrawingHide] = useState(false)
  const [enablePen, setEnablePen] = useState(false)
  const [color, setColor] = useState('#ff0000')
  const [lineWidth, setLineWidth] = useState(5)
  const { setRecord } = useLessonRecorderContext()

  function resetCanvasSize() {
    canvasCtxRef.current.canvas.width = canvasCtxRef.current.canvas.clientWidth
    canvasCtxRef.current.canvas.height = canvasCtxRef.current.canvas.clientHeight

    redrawFromHistory()
  }

  function startDrawing(e) {
    if (isMobileDeviceRef.current && e.type === 'mousedown') return // モバイルではtouchstart後にmousedownが呼ばれるのでスキップ
    if (enablePen && !isDrawingHide) {
      switchSwipable(false)
      isClearedRef.current = false
      isDrawingRef.current = true
      startDrawingTimeRef.current = new Date()

      const [x, y] = mouseOrTouchPositions(e, ['touchstart'])
      drawEdgeCircle(x, y, color)

      canvasCtxRef.current.beginPath()

      startPositionRef.current = { x, y }
      createNewHistory()
    } else {
      startDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function inDrawing(e) {
    if (enablePen && !isDrawingHide) {
      if (!isDrawingRef.current) return

      const [x, y] = mouseOrTouchPositions(e, ['touchmove'])
      drawLine(x, y)
      startPositionRef.current = { x, y }
    } else {
      inDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function endDrawing(e) {
    if (isMobileDeviceRef.current && e.type === 'mouseup') return // モバイルではtouchend後にmouseupが呼ばれるのでスキップ
    if (enablePen && !isDrawingHide) {
      if (!isDrawingRef.current) return
      switchSwipable(true)

      const [x, y] = mouseOrTouchPositions(e, ['touchend', 'touchcancel'])
      drawLine(x, y)
      drawEdgeCircle(x, y, color)

      setRecord({
        kind: 'drawing',
        action: 'draw',
        durationMillisec: new Date() - startDrawingTimeRef.current,
        value: histories[histories.length - 1],
      })

      isDrawingRef.current = false
    } else {
      endDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function drawEdgeCircle(x, y, currentColor) {
    canvasCtxRef.current.beginPath()
    canvasCtxRef.current.arc(x, y, canvasCtxRef.current.lineWidth / 2, 0, Math.PI * 2)
    canvasCtxRef.current.fillStyle = currentColor
    canvasCtxRef.current.fill()
    canvasCtxRef.current.closePath()
  }

  function drawLine(x, y) {
    if (isSamePosition(startPositionRef.current, { x, y })) return

    canvasCtxRef.current.globalCompositeOperation = isEraser() ? 'destination-out': 'source-over'
    // カーブの終点をマウスの動く前の座標に、頂点を動いた後の座標にすると滑らかな線が描画できる
    canvasCtxRef.current.quadraticCurveTo(startPositionRef.current.x, startPositionRef.current.y, x, y)
    canvasCtxRef.current.stroke()

    addHistory({ x, y })
  }

  function redrawFromHistory() {
    clearCanvas()

    histories.forEach(h => {
      if (h.clear) {
        clearCanvas()
      } else {
        canvasCtxRef.current.strokeStyle = h.color
        canvasCtxRef.current.lineWidth = h.lineWidth
        canvasCtxRef.current.globalCompositeOperation = h.eraser ? 'destination-out': 'source-over'
        const coef = { x: canvasCtxRef.current.canvas.clientWidth / h.width, y: canvasCtxRef.current.canvas.clientHeight / h.height }

        const circlePositions = calcResizePosition(coef, h.positions[0], h.positions[h.positions.length - 1])
        drawEdgeCircle(circlePositions[0], circlePositions[1], h.color)

        canvasCtxRef.current.beginPath()
        h.positions.slice(1).forEach((d, i) => {
          canvasCtxRef.current.quadraticCurveTo(...calcResizePosition(coef, h.positions[i], d))
          canvasCtxRef.current.stroke()
        })

        drawEdgeCircle(circlePositions[2], circlePositions[3], h.color)
      }
    })

    canvasCtxRef.current.strokeStyle = color
    canvasCtxRef.current.lineWidth = lineWidth
  }

  function clearCanvas() {
    canvasCtxRef.current.clearRect(0, 0, canvasCtxRef.current.canvas.clientWidth, canvasCtxRef.current.canvas.clientHeight)
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
      width: canvasCtxRef.current.canvas.clientWidth,
      height: canvasCtxRef.current.canvas.clientHeight,
      color: color,
      eraser: isEraser(),
      lineWidth: lineWidth,
      positions: [startPositionRef.current],
    })
  }

  function addHistory(drawing) {
    histories[histories.length - 1].positions.push(drawing)
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
    isClearedRef.current = false
  }

  function clearDrawing() {
    if (isClearedRef.current) return

    addClearHistory()
    clearCanvas()
    setRecord({ kind: 'drawing', action: 'clear' })
    isClearedRef.current = true
  }

  function isEraser() {
    return color === 'eraser'
  }

  function hideDrawing(isHide) {
    setRecord({ kind: 'drawing', action: isHide ? 'hide': 'show' })
    setIsDrawingHide(isHide)
  }

  useEffect(() => {
    isMobileDeviceRef.current = window.ontouchstart !== undefined
    canvasCtxRef.current = drawingRef.current.getContext('2d')
  }, [])

  useEffect(() => {
    if (!hasResize) return
    resetCanvasSize()
  }, [hasResize])

  useEffect(() => {
    if (isEraser()) {
      canvasCtxRef.current.globalCompositeOperation = 'destination-out'
    } else {
      canvasCtxRef.current.globalCompositeOperation = 'source-over'
      canvasCtxRef.current.strokeStyle = color
    }
  }, [color])

  useEffect(() => {
    canvasCtxRef.current.lineWidth = lineWidth
  }, [lineWidth])

  return {
    isDrawingHide, setIsDrawingHide: hideDrawing, enablePen, setEnablePen, undoDrawing, clearDrawing,
    drawingColor: color, setDrawingColor: setColor, setDrawingLineWidth: setLineWidth,
    startDrawing, inDrawing, endDrawing, drawingRef
  }
}