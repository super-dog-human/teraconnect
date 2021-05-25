import { useRef, useState, useEffect } from 'react'
import { switchSwipable, mouseOrTouchPositions } from '../../utils'
import { drawToCanvas, drawEdgeCircle, clearCanvas } from '../../drawingUtils'

const initialColor = '#ff0000'

export default function useDrawingRecorder({ hasResize, drawingRef, startDragging, inDragging, endDragging, setRecord }) {
  const canvasCtxRef = useRef()
  const coefficientRef = useRef({ x: 0, y: 0 })
  const isMobileDeviceRef = useRef()
  const startPositionRef = useRef({})
  const startDrawingTimeRef = useRef()
  const isDrawingRef = useRef(false)
  const isClearedRef = useRef(true)
  const historiesRef = useRef([])
  const [isDrawingHide, setIsDrawingHide] = useState(false)
  const [enablePen, setEnablePen] = useState(false)
  const [enableEraser, setEnableEraser] = useState(false)
  const [color, setColor] = useState(initialColor)
  const [lineWidth, setLineWidth] = useState('5')

  function startDrawing(e) {
    if (isMobileDeviceRef.current && e.type === 'mousedown') return // モバイルではtouchstart後にmousedownが呼ばれるのでスキップ
    if ((enablePen || enableEraser) && !isDrawingHide) {
      switchSwipable(false)
      isClearedRef.current = false
      isDrawingRef.current = true
      startDrawingTimeRef.current = new Date()

      canvasCtxRef.current.lineWidth = lineWidth
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
    if ((enablePen || enableEraser) && !isDrawingHide) {
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
    if ((enablePen || enableEraser) && !isDrawingHide) {
      if (!isDrawingRef.current) return
      switchSwipable(true)

      const [x, y] = calcResizePosition(e, ['touchend', 'touchcancel'])
      drawLine(x, y)
      drawEdgeCircle(canvasCtxRef.current, x, y, color)

      setRecord({
        kind: 'drawing',
        action: 'draw',
        durationMillisec: new Date() - startDrawingTimeRef.current,
        value: historiesRef.current[historiesRef.current.length - 1],
      })

      isDrawingRef.current = false
    } else if (endDragging) {
      endDragging(e) // ペンが有効でない時はアバターを操作する
    }
  }

  function undoDrawing(keepCurrent=false) {
    if (historiesRef.current.length === 0) return

    historiesRef.current.pop()
    redrawFromHistory(keepCurrent)
    setRecord({ kind: 'drawing', action: 'undo' })
    isClearedRef.current = false
  }

  function drawLine(x, y) {
    if (isSamePosition(startPositionRef.current, { x, y })) return

    canvasCtxRef.current.strokeStyle = color
    canvasCtxRef.current.lineWidth = lineWidth
    canvasCtxRef.current.globalCompositeOperation = enableEraser ? 'destination-out': 'source-over'
    // カーブの終点をマウスの動く前の座標に、頂点を動いた後の座標にすると滑らかな線が描画できる
    canvasCtxRef.current.quadraticCurveTo(startPositionRef.current.x, startPositionRef.current.y, x, y)
    canvasCtxRef.current.stroke()

    addHistory({ x, y })
  }

  function clearDrawing() {
    if (isClearedRef.current) return

    addClearHistory()
    clearCanvas(canvasCtxRef.current)
    setRecord({ kind: 'drawing', action: 'clear' })
    isClearedRef.current = true
  }

  function hideDrawing(isHide) {
    setRecord({ kind: 'drawing', action: isHide ? 'hide': 'show' })
    setIsDrawingHide(isHide)
  }

  function calcResizePosition(e, positions) {
    const [x, y] = mouseOrTouchPositions(e, positions)
    return [coefficientRef.current.x * x, coefficientRef.current.y * y,].map(f => (Math.round(f)))
  }

  function isSamePosition(oldPosition, newPosition) {
    return oldPosition.x === newPosition.x && oldPosition.y === newPosition.y
  }

  function createNewHistory() {
    historiesRef.current.push({
      clear: false,
      color: enableEraser ? '' : color,
      eraser: enableEraser,
      lineWidth: lineWidth,
      positions: [startPositionRef.current],
    })
  }

  function addHistory(drawing) {
    historiesRef.current[historiesRef.current.length - 1].positions.push(drawing)
  }

  function addClearHistory() {
    if (historiesRef.current.length === 0) return
    historiesRef.current.push({ clear: true })
  }

  function redrawFromHistory(keepCurrent=false) {
    if (!keepCurrent) clearCanvas(canvasCtxRef.current)

    historiesRef.current.forEach(history => {
      if (history.clear) {
        clearCanvas(canvasCtxRef.current)
      } else {
        drawToCanvas(canvasCtxRef.current, history)
      }
    })

    canvasCtxRef.current.strokeStyle = color
    canvasCtxRef.current.lineWidth = lineWidth
  }

  function resetHistories() {
    historiesRef.current = []
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
    if (enablePen) {
      setEnableEraser(false)
    }
  }, [enablePen])

  useEffect(() => {
    if (enableEraser) {
      setEnablePen(false)
    }
  }, [enableEraser])

  useEffect(() => {
    if (enableEraser) {
      canvasCtxRef.current.globalCompositeOperation = 'destination-out'
    } else {
      canvasCtxRef.current.globalCompositeOperation = 'source-over'
    }
  }, [color, enableEraser])

  return {
    isDrawingHide, setIsDrawingHide: hideDrawing, enablePen, setEnablePen, enableEraser, setEnableEraser,
    undoDrawing, clearDrawing, drawingColor: color, setDrawingColor: setColor,
    drawingLineWidth: lineWidth, setDrawingLineWidth: setLineWidth, startDrawing, inDrawing, endDrawing, resetHistories
  }
}