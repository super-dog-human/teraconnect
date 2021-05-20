import { useRef, useState, useEffect } from 'react'
import { switchSwipable, mouseOrTouchPositions } from '../../utils'
import { drawToCanvas, drawEdgeCircle, clearCanvas } from '../../drawingUtils'

const histories = []

export default function useDrawingRecorder({ hasResize, startDragging, inDragging, endDragging, setRecord }) {
  const canvasCtxRef = useRef()
  const coefficientRef = useRef({ x: 0, y: 0 })
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

  function startDrawing(e) {
    if (isMobileDeviceRef.current && e.type === 'mousedown') return // モバイルではtouchstart後にmousedownが呼ばれるのでスキップ
    if (enablePen && !isDrawingHide) {
      switchSwipable(false)
      isClearedRef.current = false
      isDrawingRef.current = true
      startDrawingTimeRef.current = new Date()

      const [x, y] = calcResizePosition(e, ['touchstart'])
      drawEdgeCircle(canvasCtxRef.current, x, y, color)

      canvasCtxRef.current.beginPath()

      startPositionRef.current = { x, y }
      createNewHistory()
    } else if (startDragging) {
      startDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function inDrawing(e) {
    if (enablePen && !isDrawingHide) {
      if (!isDrawingRef.current) return

      const [x, y] = calcResizePosition(e, ['touchmove'])
      drawLine(x, y)
      startPositionRef.current = { x, y }
    } else if (inDragging) {
      inDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function endDrawing(e) {
    if (isMobileDeviceRef.current && e.type === 'mouseup') return // モバイルではtouchend後にmouseupが呼ばれるのでスキップ
    if (enablePen && !isDrawingHide) {
      if (!isDrawingRef.current) return
      switchSwipable(true)

      const [x, y] = calcResizePosition(e, ['touchend', 'touchcancel'])
      drawLine(x, y)
      drawEdgeCircle(canvasCtxRef.current, x, y, color)

      setRecord({
        kind: 'drawing',
        action: 'draw',
        durationMillisec: new Date() - startDrawingTimeRef.current,
        value: histories[histories.length - 1],
      })

      isDrawingRef.current = false
    } else if (endDragging) {
      endDragging(e) // ペンが有効でない時はアバターを操作する
    }
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
    clearCanvas(canvasCtxRef.current)

    histories.forEach(history => {
      if (history.clear) {
        clearCanvas(canvasCtxRef.current)
      } else {
        drawToCanvas(canvasCtxRef.current, history)
      }
    })

    canvasCtxRef.current.strokeStyle = color
    canvasCtxRef.current.lineWidth = lineWidth
  }

  function calcResizePosition(e, positions) {
    const [x, y] = mouseOrTouchPositions(e, positions)
    return [coefficientRef.current.x * x, coefficientRef.current.y * y,].map(f => (Math.round(f)))
  }

  function isSamePosition(oldPosition, newPosition) {
    return oldPosition.x === newPosition.x && oldPosition.y === newPosition.y
  }

  function createNewHistory() {
    histories.push({
      clear: false,
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
    clearCanvas(canvasCtxRef.current)
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
    coefficientRef.current = { x: 1280 / canvasCtxRef.current.canvas.clientWidth, y: 720 / canvasCtxRef.current.canvas.clientHeight }
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