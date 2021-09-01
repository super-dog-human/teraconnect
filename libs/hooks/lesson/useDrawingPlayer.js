import { useState, useRef, useCallback, useEffect } from 'react'
import { drawToCanvas, clearCanvas } from '../../drawingUtils'
import useDrawingPicture from './useDrawingPicture'
import { deepCopy } from '../../utils'

export default function useDrawingPlayer({ drawings, sameTimeIndex=-1, startElapsedTime, elapsedTimeRef }) {
  const [didUpdateDrawings, setDidUpdateDrawings] = useState(false)
  const canvasRef = useRef()
  const canvasCtxRef = useRef()
  const preStrokeRef = useRef({})
  const preUndoRef = useRef({})
  const preClearRef = useRef(-1)
  const { drawPicture } = useDrawingPicture({ canvasRef })

  const setPictureBeforeDrawing = useCallback(() => {
    clearDrawing()
    if (sameTimeIndex < 0) return

    const targetDrawings = []
    targetDrawings.push(...drawings.filter(d => d.elapsedTime < startElapsedTime))
    targetDrawings.push(...drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i < sameTimeIndex))
    drawPicture(targetDrawings)
  }, [sameTimeIndex, drawings, startElapsedTime, drawPicture])

  const setCompletedPicture = useCallback(() => {
    clearDrawing()
    const targetDrawings = []
    targetDrawings.push(...drawings.filter(d => d.elapsedTime < startElapsedTime))
    targetDrawings.push(...drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i <= sameTimeIndex))
    drawPicture(targetDrawings)
  }, [sameTimeIndex, drawings, startElapsedTime, drawPicture])

  const undo = useCallback(({ drawingIndex, unitIndex, currentElapsedTime }) => {
    if (drawingIndex < preUndoRef.current.drawingIndex) return
    if (drawingIndex === preUndoRef.current.drawingIndex && unitIndex <= preUndoRef.current.unitIndex) return
    clearDrawing()

    const drawingsToUndo = []
    if (sameTimeIndex >= 0) {
      drawingsToUndo.push(...drawings.filter(d => d.elapsedTime < startElapsedTime))
      drawingsToUndo.push(...deepCopy(drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i <= sameTimeIndex)))
    } else {
      drawingsToUndo.push(...deepCopy(drawings.filter(d => d.elapsedTime <= currentElapsedTime)))
    }
    const lastDrawing = drawingsToUndo[drawingsToUndo.length - 1]
    lastDrawing.units = lastDrawing.units.slice(0, unitIndex + 1) // 現時点までの描画データ

    drawPicture(drawingsToUndo) // このメソッドでundoを加味して描画する

    preUndoRef.current = { drawingIndex, unitIndex }
  }, [sameTimeIndex, drawings, startElapsedTime, drawPicture])

  const draw = useCallback(incrementalTime =>{
    const targetDrawings = []
    if (sameTimeIndex >= 0) {
      // 編集中の一部再生
      targetDrawings.push(...drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i === sameTimeIndex))
    } else {
      // フル再生
      targetDrawings.push(...drawings)
    }

    targetDrawings.forEach((drawing, drawingIndex) => {
      const currentElapsedTime = elapsedTimeRef.current + incrementalTime
      if (currentElapsedTime < drawing.elapsedTime) return

      switch(drawing.action) {
      case 'draw':
        drawing.units.forEach((unit, unitIndex) => {
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
              drawStrokePart({ stroke: unit.stroke, drawingIndex, unitIndex, positionIndex })
            }
          } else {
            undo({ drawingIndex, unitIndex, currentElapsedTime })
          }
        })
        return
      case 'clear': {
        if (drawingIndex <= preClearRef.current) return
        clearDrawing()
        preClearRef.current = drawingIndex
        return
      }
      case 'show':
        canvasRef.current.style.opacity = 1
        return
      case 'hide':
        canvasRef.current.style.opacity = 0
        return
      }
    })
  }, [sameTimeIndex, drawings, startElapsedTime, elapsedTimeRef, undo])

  function drawStrokePart({ stroke, drawingIndex, unitIndex, positionIndex }) {
    if (drawingIndex < preStrokeRef.current.drawingIndex) return
    if (drawingIndex === preStrokeRef.current.drawingIndex && unitIndex < preStrokeRef.current.unitIndex) return
    if (drawingIndex === preStrokeRef.current.drawingIndex && unitIndex === preStrokeRef.current.unitIndex && positionIndex <= preStrokeRef.current.positionIndex) return

    const newStroke = { ...stroke }
    newStroke.positions = stroke.positions.slice(0, positionIndex) // 線をつなげるため毎回0から描画する
    drawToCanvas(canvasCtxRef.current, newStroke)

    preStrokeRef.current = { drawingIndex, unitIndex, positionIndex }
  }

  function initializeDrawing() {
    setPictureBeforeDrawing()
    clearHistory()
  }

  function finishDrawing() {
    draw(0) // 経過時間が終了時間に達した際、描写しきれなかったものが発生しうるので最後にもう一度描写する
    clearHistory()
  }

  function resetBeforeSeeking() {
    setPictureBeforeDrawing()
    clearHistory()
  }

  function clearHistory() {
    preStrokeRef.current = {}
    preUndoRef.current = {}
    preClearRef.current = -1
  }

  function clearDrawing() {
    clearCanvas(canvasCtxRef.current)
  }

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
  }, [])

  useEffect(() => {
    if (!drawings) return
    setDidUpdateDrawings(true)
  }, [drawings])

  useEffect(() => {
    if (!didUpdateDrawings) return
    setDidUpdateDrawings(false)
    setPictureBeforeDrawing()
    clearHistory()
    draw(0)
  }, [didUpdateDrawings, setPictureBeforeDrawing, draw])

  return { drawingRef: canvasRef, updateDrawing: draw, initializeDrawing, finishDrawing, resetBeforeSeeking, resetBeforeUndo: setCompletedPicture }
}