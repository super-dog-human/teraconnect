import { useRef, useState, useEffect } from 'react'
import { drawToCanvas, clearCanvas } from '../../drawingUtils'
import { Clock } from 'three'
import useDrawingPicture from './useDrawingPicture'

export default function useDrawingPlayer({ isPlaying, setIsPlaying, drawings, drawing, sameTimeIndex, startElapsedTime, endElapsedTime }) {
  const canvasRef = useRef()
  const canvasCtxRef = useRef()
  const animationRequestRef = useRef(0)
  const clockRef = useRef()
  const elapsedTimeRef = useRef(startElapsedTime)
  const preStrokeRef = useRef({})
  const preUndoRef = useRef()
  const [playerElapsedTime, setPlayerElapsedTime] = useState(0)
  const { drawPicture } = useDrawingPicture({ canvasRef, drawings, startElapsedTime })

  function setCompletedPicture() {
    const currentDrawing = drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i <= sameTimeIndex)
    drawPicture(currentDrawing)
  }

  function setPictureBeforeDrawing() {
    const currentDrawing = drawings.filter(d => d.elapsedTime === startElapsedTime).filter((_, i) => i < sameTimeIndex)
    drawPicture(currentDrawing)
  }

  function draw(isOnce=false) {
    const incrementalTime = clockRef.current.getDelta()
    drawing.units.forEach((unit, unitIndex) => {
      const currentElapsedTime = elapsedTimeRef.current + incrementalTime
      if (currentElapsedTime < unit.elapsedTime) return

      if (unit.action === 'draw') {
        let positionIndex
        if (currentElapsedTime < unit.elapsedTime + unit.durationSec) {
          // 経過時間がunitの途中までなら、時間を案分して描画するstrokeの数を求める
          const timePerUnit = unit.stroke.positions.length / unit.durationSec
          const diffTime = currentElapsedTime - unit.elapsedTime
          positionIndex = Math.round(timePerUnit * diffTime) - 1
        } else {
          // 経過時間がunitの終端ちょうどか次のunitをまたいでいるなら、このunitのstrokeは全数が対象になる
          positionIndex = unit.stroke.positions.length - 1
        }
        if (positionIndex > 0) {
          drawStrokePart(unit.stroke, unitIndex, positionIndex)
        }
      } else {
        undo(unitIndex)
      }
    })

    if (isOnce) return

    elapsedTimeRef.current += incrementalTime
    updatePlayerElapsedTime()

    if (elapsedTimeRef.current >= endElapsedTime) {
      finishPlaying()
      return
    }

    animationRequestRef.current = requestAnimationFrame(() => draw())
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

  function seekDrawing(elapsedTime) {
    stopDrawing()
    clearCanvas(canvasCtxRef.current)
    setPictureBeforeDrawing()

    preStrokeRef.current = {}
    preUndoRef.current = null
    elapsedTimeRef.current = startElapsedTime + elapsedTime // プレイヤーからのelapsedTimeは相対時間なので開始時間を加算する

    if (isPlaying) {
      startDrawing()
    } else {
      draw(true)
    }
  }

  function startDrawing() {
    clockRef.current.start()
    if (elapsedTimeRef.current === startElapsedTime) {
      setPlayerElapsedTime(0)
      clearCanvas(canvasCtxRef.current)
      setPictureBeforeDrawing()
    }
    draw()
  }

  function stopDrawing() {
    clockRef.current.stop()
    if (animationRequestRef.current > 0) {
      cancelAnimationFrame(animationRequestRef.current)
      animationRequestRef.current = 0
    }
  }

  function finishPlaying() {
    draw(true) // 経過時間が終了時間に達した際、描写しきれなかったものが発生しうるので最後にもう一度描写する
    elapsedTimeRef.current = startElapsedTime
    clockRef.current.stop()
    clockRef.current = new Clock(false)
    preStrokeRef.current = {}
    preUndoRef.current = null
    setIsPlaying(false)
  }

  function updatePlayerElapsedTime() {
    // シークバーの精度として小数点以下3桁は細かすぎるため2桁に落とす
    const realElapsedTime = parseFloat((elapsedTimeRef.current - startElapsedTime).toFixed(2))
    const durationSec = parseFloat(drawing.durationSec.toFixed(2))
    setPlayerElapsedTime(Math.min(realElapsedTime, durationSec)) // 再生時間は収録時間を超える場合があるので抑制する
  }

  useEffect(() => {
    clockRef.current = new Clock(false)
    canvasCtxRef.current = canvasRef.current.getContext('2d')
    return stopDrawing
  }, [])

  useEffect(() => {
    if (!drawings) return
    setCompletedPicture()
  }, [drawings])

  useEffect(() => {
    if (isPlaying) {
      startDrawing()
    } else {
      stopDrawing()
    }
  }, [isPlaying])

  return { canvasRef, elapsedTime: playerElapsedTime, seekDrawing }
}