import { useRef, useState, useEffect } from 'react'
import usePlayerController from './usePlayerController'
import useDrawingPlayer from './useDrawingPlayer'

export default function useLessonPlayer({ startElapsedTime=0, durationSec, avatars, graphics, drawings, speeches, sameTimeIndex }) {
  const animationRequestRef = useRef(0)
  const elapsedTimeRef = useRef(startElapsedTime)
  const { isPlayerHover, isPlaying, setIsPlaying, playerElapsedTime, setPlayerElapsedTime, deltaTime, resetClock, switchClock,
    handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart } = usePlayerController()
  const [isPreparing, setIsPreparing] = useState(false)
  const { drawingRef, draw, initialStartDrawing, seekDrawing, finishDrawing } = useDrawingPlayer({ drawings, sameTimeIndex, startElapsedTime, elapsedTimeRef })

  function animation() {
    const incrementalTime = deltaTime()

    if (drawings) draw(incrementalTime)
    elapsedTimeRef.current += incrementalTime

    updatePlayerElapsedTime()

    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      finishPlaying()
      return
    }

    animationRequestRef.current = requestAnimationFrame(() => animation())
  }

  function startPlaying() {
    switchClock(true)

    if (elapsedTimeRef.current === startElapsedTime) {
      setPlayerElapsedTime(0)
      if (drawings) initialStartDrawing()
    }

    animation()
  }

  function stopPlaying() {
    switchClock(false)

    if (animationRequestRef.current > 0) {
      cancelAnimationFrame(animationRequestRef.current)
      animationRequestRef.current = 0
    }
  }

  function handleSeekChange(e) {
    stopPlaying()
    if (drawings) seekDrawing()

    elapsedTimeRef.current = startElapsedTime + parseFloat(e.target.value) // プレイヤーからのelapsedTimeは相対時間なので開始時間を加算する

    if (isPlaying) {
      startPlaying()
    } else {
      draw(0)
    }
  }

  function finishPlaying() {
    if (drawings) finishDrawing()

    elapsedTimeRef.current = startElapsedTime
    switchClock(false)
    resetClock()
    setIsPlaying(false)
  }

  function updatePlayerElapsedTime() {
    // シークバーの精度として小数点以下3桁は細かすぎるため、2桁に落とす
    const realElapsedTime = parseFloat((elapsedTimeRef.current - startElapsedTime).toFixed(2))
    const drawingDurationSec = parseFloat(durationSec.toFixed(2))
    setPlayerElapsedTime(Math.min(realElapsedTime, drawingDurationSec)) // 実再生時間は収録時間を超える場合があるので小さい方を採用
  }

  useEffect(() => {
    return stopPlaying
  }, [])

  useEffect(() => {
    if (isPlaying) {
      // 再生前の声準備でローディング入れる
      startPlaying()
    } else {
      stopPlaying()
    }
  }, [isPlaying])

  return { drawingRef, isPlaying, isPreparing, isPlayerHover, playerElapsedTime, handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart, handleSeekChange }
}