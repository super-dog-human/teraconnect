import { useRef, useEffect } from 'react'
import { drawToCanvas, clearCanvas } from '../../drawingUtils'
import useDrawingPicture from './useDrawingPicture'

export default function useDrawingPlayer({ drawings, sameTimeIndex=-1, startElapsedTime, elapsedTimeRef }) {
  const canvasRef = useRef()
  const canvasCtxRef = useRef()
  const preStrokeRef = useRef({})
  const preUndoRef = useRef()
  const { drawPicture } = useDrawingPicture({ canvasRef, drawings, startElapsedTime })

  function setCompletedPicture() {
    clearCanvas(canvasCtxRef.current)
    const targetDrawings = drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i <= sameTimeIndex)
    drawPicture(targetDrawings)
  }

  function setPictureBeforeDrawing() {
    clearCanvas(canvasCtxRef.current)
    const targetDrawings = drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i < sameTimeIndex)
    drawPicture(targetDrawings)
  }

  function draw(incrementalTime) {
    const targetDrawings = []
    if (sameTimeIndex >= 0) {
      // 編集中の一部再生
      targetDrawings.push(...drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i === sameTimeIndex))
    } else {
      // フル再生
      targetDrawings.push(...drawings)
    }

    targetDrawings.forEach(drawing => {
      switch(drawing.action) {
      case 'draw':
        drawing.units.forEach((unit, unitIndex) => {
          const currentElapsedTime = elapsedTimeRef.current + incrementalTime
          if (currentElapsedTime < unit.elapsedTime) return

          if (unit.action === 'draw') {
            let positionIndex
            if (currentElapsedTime < unit.elapsedTime + unit.durationSec) {
              // 経過時間がunitの途中までなら、時間を案分して描画するstrokeの数を求める
              const timePerUnit = unit.stroke.positions.length / unit.durationSec
              const diffTime = currentElapsedTime - unit.elapsedTime
              positionIndex = Math.round(timePerUnit * diffTime)
            } else {
              // 経過時間がunitの終端ちょうどか次のunitをまたいでいるなら、このunitのstrokeは全数が対象になる
              positionIndex = unit.stroke.positions.length
            }
            if (positionIndex > 0) {
              drawStrokePart(unit.stroke, unitIndex, positionIndex)
            }
          } else {
            undo(unitIndex)
          }
        })
        return
      case 'clear':
        clearCanvas(canvasCtxRef.current)
        return
      case 'show':
        canvasRef.current.style.opacity = 1
        return
      case 'hide':
        canvasRef.current.style.opacity = 0
        return
      }
    })
  }

  function undo(unitIndex) {
    if (unitIndex <= preUndoRef.current) return

    clearCanvas(canvasCtxRef.current)
    const drawingsToUndo = drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i <= sameTimeIndex)
    const lastDrawing = drawingsToUndo[drawingsToUndo.length - 1]
    lastDrawing.units = lastDrawing.units.slice(0, unitIndex + 1)
    drawPicture(drawingsToUndo)

    preUndoRef.current = unitIndex
  }

  function drawStrokePart(stroke, unitIndex, positionIndex) {
    if (unitIndex < preStrokeRef.current.unitIndex) return
    if (unitIndex === preStrokeRef.current.unitIndex && positionIndex <= preStrokeRef.current.positionIndex) return

    const newStroke = { ...stroke }
    newStroke.positions = stroke.positions.slice(0, positionIndex) // 線をつなげるため毎回0から描画する
    drawToCanvas(canvasCtxRef.current, newStroke)

    preStrokeRef.current.unitIndex = unitIndex
    preStrokeRef.current.positionIndex = positionIndex
  }

  function initialStartDrawing() {
    setPictureBeforeDrawing()
  }

  function finishDrawing() {
    draw(0) // 経過時間が終了時間に達した際、描写しきれなかったものが発生しうるので最後にもう一度描写する
    preStrokeRef.current = {}
    preUndoRef.current = null
  }

  function resetForSeekDrawing() {
    setPictureBeforeDrawing()

    preStrokeRef.current = {}
    preUndoRef.current = null
  }

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
  }, [])

  useEffect(() => {
    if (!drawings) return
    setCompletedPicture()
  }, [drawings])

  return { drawingRef: canvasRef, draw, initialStartDrawing, finishDrawing, resetForSeekDrawing }
}