import { useRef, useState, useEffect } from 'react'
import { drawToCanvas, clearCanvas } from '../../drawingUtils'
import { Clock } from 'three'
import useDrawingPicture from './useDrawingPicture'

export default function useDrawingPlayer({ isPlaying, setIsPlaying, drawings, drawing, startElapsedTime, endElapsedTime }) {
  const drawingRef = useRef(drawing)
  const canvasRef = useRef()
  const canvasCtxRef = useRef()
  const animationRequestRef = useRef()
  const clockRef = useRef(0)
  const elapsedTimeRef = useRef(startElapsedTime)
  const [playerElapsedTime, setPlayerElapsedTime] = useState(0)
  const preStrokeRef = useRef({})
  const { drawPicture } = useDrawingPicture({ canvasRef, drawings })

  function draw(isOnce) {
    const incrementalTime = clockRef.current.getDelta()
    drawingRef.current.units.forEach((unit, unitIndex) => {
      if (unit.action === 'draw') {
        const preElapsedTime = elapsedTimeRef.current
        const currentElapsedTime = preElapsedTime + incrementalTime
        if (preElapsedTime > unit.elapsedTime + unit.durationSec) return
        if (currentElapsedTime < unit.elapsedTime) return

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
        clearCanvas(canvasCtxRef.current)
        undo()
      }
    })

    elapsedTimeRef.current += incrementalTime
    setPlayerElapsedTime(parseFloat((elapsedTimeRef.current - startElapsedTime).toFixed(1)))

    if (isOnce === true) return // 最後に実行される際はboolの引数になる

    if (elapsedTimeRef.current >= endElapsedTime) {
      setPlayerElapsedTime(parseFloat(drawing.durationSec.toFixed(1)))
      finishPlaying()
      return
    }

    animationRequestRef.current = requestAnimationFrame(draw)
  }

  function undo() {
    // units内のdrawingなものを自身から遡って取得する
    // drawPictureで直前の時間までのものを実行
    // drawToCanvasで必要なもののみを実行
  }

  function drawStrokePart(stroke, unitIndex, positionIndex) {
    if (unitIndex === preStrokeRef.current.unitIndex && positionIndex === preStrokeRef.current.positionIndex) return

    const newStroke = { ...stroke }
    newStroke.positions = stroke.positions.slice(0, positionIndex) // 線をつなげるため毎回0から描画する
    drawToCanvas(canvasCtxRef.current, newStroke)

    preStrokeRef.current.unitIndex = unitIndex
    preStrokeRef.current.positionIndex = positionIndex
  }

  function drawAt(elapsedTime) {
    // drawPicture(elapsedTime, []) // 今回の描画は空配列で実行する
    // 同時刻のものがあれば一番最後のdrawingsを取得
    // 手動でdrawToCanvasする
  }

  function stopDrawing() {
    if (animationRequestRef.current) {
      cancelAnimationFrame(animationRequestRef.current)
      clockRef.current = 0
    }
  }

  function finishPlaying() {
    draw(true) // 経過時間が終端を大きくまたいで終了する際、残った描画を最後に実行
    elapsedTimeRef.current = startElapsedTime
    clockRef.current = null
    preStrokeRef.current = {}
    setIsPlaying(false)
  }

  useEffect(() => {
    canvasCtxRef.current = canvasRef.current.getContext('2d')
    return stopDrawing
  }, [])

  useEffect(() => {
    if (!drawings) return
    drawPicture(startElapsedTime, drawing)
  }, [drawings])

  useEffect(() => {
    drawingRef.current = drawing
  }, [drawing])

  useEffect(() => {
    if (isPlaying) {
      clockRef.current = new Clock()
      if (elapsedTimeRef.current === startElapsedTime) {
        setPlayerElapsedTime(0)
        clearCanvas(canvasCtxRef.current)
        // drawAt()
      }
      draw()
    } else {
      stopDrawing()
    }
  }, [isPlaying])

  return { canvasRef, elapsedTime: playerElapsedTime }
}