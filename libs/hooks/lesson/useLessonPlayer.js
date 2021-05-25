import { useRef, useState, useEffect } from 'react'
import usePlayerController from './usePlayerController'
import useDrawingPlayer from './useDrawingPlayer'

export default function useLessonPlayer({ startElapsedTime=0, durationSec, avatars, graphics, drawings, speeches, sameTimeIndex }) {
  const animationRequestRef = useRef(0)
  const elapsedTimeRef = useRef(startElapsedTime)
  const [isPreparing, setIsPreparing] = useState(false)
  const { isPlayerHover, isPlaying, setIsPlaying, playerElapsedTime, setPlayerElapsedTime, deltaTime, resetClock, switchClock,
    handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart } = usePlayerController()
  const { drawingRef, draw, initialStartDrawing, resetBeforeDrawing, finishDrawing } = useDrawingPlayer({ drawings, sameTimeIndex, startElapsedTime, elapsedTimeRef })

  function animation() {
    animationRequestRef.current = requestAnimationFrame(animation)

    let incrementalTime = deltaTime()
    if (elapsedTimeRef.current + incrementalTime - startElapsedTime > durationSec) {
      incrementalTime = startElapsedTime + durationSec - elapsedTimeRef.current // 経過時間の積算が収録時間を超えてしまう場合の調整
    }

    if (drawings) draw(incrementalTime)

    elapsedTimeRef.current += incrementalTime
    updatePlayerElapsedTime()

    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      finishPlaying()
      return
    }
  }

  function startPlaying() {
    switchClock(true)

    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      elapsedTimeRef.current = startElapsedTime
      setPlayerElapsedTime(0)
    }

    if (elapsedTimeRef.current === startElapsedTime) {
      if (drawings) initialStartDrawing()
    }

    animation()
  }

  function stopPlaying() {
    switchClock(false)

    if (animationRequestRef.current !== 0) {
      cancelAnimationFrame(animationRequestRef.current)
      animationRequestRef.current = 0
    }
  }

  function handleSeekChange(e) {
    stopPlaying()
    if (drawings) resetBeforeDrawing()

    // プレイヤーからのelapsedTimeは相対時間なので開始時間を加算する
    elapsedTimeRef.current = startElapsedTime + parseFloat(e.target.value)

    if (isPlaying) {
      startPlaying()
    } else {
      draw(0)
    }
  }

  function finishPlaying() {
    if (drawings) finishDrawing()

    switchClock(false)
    resetClock()
    setIsPlaying(false)
  }

  function updatePlayerElapsedTime() {
    // シークバーの精度として小数点以下3桁は細かすぎるため、2桁に落とす
    setPlayerElapsedTime(parseFloat((elapsedTimeRef.current - startElapsedTime).toFixed(2)))
  }

  function getElapsedTime() {
    return elapsedTimeRef.current
  }

  useEffect(() => {
    return stopPlaying
  }, [])

  useEffect(() => {
    if (isPlaying) {
      // 再生前の声準備でローディング入れる
      // setIsPreparing(true)
      // setIsPreparing(false)
      startPlaying()
    } else {
      stopPlaying()
    }
  }, [isPlaying])

  return { drawingRef, isPlaying, setIsPlaying, isPreparing, isPlayerHover, getElapsedTime, playerElapsedTime,
    resetBeforeDrawing, handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart, handleSeekChange }
}