import { useRef, useState, useCallback, useEffect } from 'react'
import usePlayerController from './usePlayerController'
import useAvatarPlayer from './player/useAvatarPlayer'
import useDrawingPlayer from './useDrawingPlayer'
import useEmbeddingPlayer from './player/useEmbeddingPlayer'
import useGraphicPlayer from './player/useGraphicPlayer'
import useSubtitlePlayer from './player/useSubtitlePlayer'
import { useUnmount } from 'react-use'

export default function useLessonPlayer({ startElapsedTime=0, durationSec, hasResize, avatar, avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, sameTimeIndex, updateSpeeches, updateMusics }) {
  const animationRequestRef = useRef(0)
  const elapsedTimeRef = useRef(startElapsedTime)
  const preStartElapsedTimeRef = useRef(startElapsedTime)
  const [isAvatarLoading, setIsAvatarLoading] = useState(!!avatars)
  const { isPlayerHover, isPlaying, setIsPlaying, playerElapsedTime, setPlayerElapsedTime, deltaTime, resetClock, switchClock, handleMouseOver, handleMouseLeave } = usePlayerController()
  const { avatarRef, initializeAvatar, updateAvatar, seekAvatar } = useAvatarPlayer({ isPlaying, isLoading: isAvatarLoading, setIsLoading: setIsAvatarLoading, startElapsedTime, durationSec, hasResize, avatar, avatarLightColor, avatars, speeches })
  const { drawingRef, updateDrawing, initializeDrawing, finishDrawing, resetBeforeSeeking, resetBeforeUndo } = useDrawingPlayer({ drawings, sameTimeIndex, startElapsedTime, elapsedTimeRef })
  const { embedding, initializeEmbedding, updateEmbedding, seekEmbedding } = useEmbeddingPlayer({ durationSec, embeddings })
  const { graphic, initializeGraphic, updateGraphic, seekGraphic } = useGraphicPlayer({ startElapsedTime, durationSec, graphics, graphicURLs })
  const { subtitle, initializeSubtitle, updateSubtitle, seekSubtitle } = useSubtitlePlayer({ startElapsedTime, durationSec, speeches })

  useUnmount(() => {
    if (isPlaying) stopPlaying()
  })

  async function startPlaying() {
    setIsPlaying(true)

    switchClock(true)

    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      elapsedTimeRef.current = startElapsedTime
      setPlayerElapsedTime(0)
    }

    if (elapsedTimeRef.current === startElapsedTime) {
      if (avatars) initializeAvatar()
      if (drawings) initializeDrawing()
      if (embeddings) initializeEmbedding()
      if (graphics) initializeGraphic()
      if (speeches) initializeSubtitle()
    }

    playFrame()
  }

  const stopPlaying = useCallback(() => {
    setIsPlaying(false)
    switchClock(false)

    if (animationRequestRef.current !== 0) {
      cancelAnimationFrame(animationRequestRef.current)
      animationRequestRef.current = 0
    }
  }, [setIsPlaying, switchClock])

  function playFrame() {
    let incrementalTime = deltaTime()

    if (elapsedTimeRef.current + incrementalTime - startElapsedTime > durationSec) {
      incrementalTime = startElapsedTime + durationSec - elapsedTimeRef.current // 経過時間の積算が収録時間を超えてしまう場合の調整
    } else {
      animationRequestRef.current = requestAnimationFrame(playFrame)
    }

    elapsedTimeRef.current += incrementalTime

    if (elapsedTimeRef.current <= startElapsedTime + durationSec) {
      if (avatars) updateAvatar(incrementalTime)
      if (drawings) updateDrawing(incrementalTime)
      if (embeddings) updateEmbedding(incrementalTime)
      if (graphics) updateGraphic(incrementalTime)
      if (speeches) updateSubtitle(incrementalTime)
      if (updateSpeeches) updateSpeeches(incrementalTime)
      if (updateMusics) updateMusics(incrementalTime)
      updatePlayerElapsedTime()
    }

    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      finishPlaying()
      return
    }
  }

  function finishPlaying() {
    if (drawings) finishDrawing()

    stopPlaying()
    resetClock()
  }

  const updatePlayerElapsedTime = useCallback(() => {
    // シークバーの精度として小数点以下3桁は細かすぎるため、2桁に落とす
    setPlayerElapsedTime(parseFloat((elapsedTimeRef.current - startElapsedTime).toFixed(2)))
  }, [setPlayerElapsedTime, startElapsedTime])

  function getElapsedTime() {
    return elapsedTimeRef.current
  }

  function handleSeekChange(e) {
    let shouldResume = false
    if (isPlaying) {
      stopPlaying()
      shouldResume = true
    }

    // プレイヤーからのelapsedTimeは相対時間なので開始時間を加算する
    const elapsedTime = startElapsedTime + parseFloat(e.target.value)

    if (avatars) seekAvatar(e)
    if (drawings) resetBeforeSeeking()
    if (embeddings) seekEmbedding(e)
    if (graphics) seekGraphic(e)
    if (speeches) seekSubtitle(e)

    elapsedTimeRef.current = elapsedTime
    updatePlayerElapsedTime()

    if (shouldResume) {
      startPlaying()
    } else {
      updateDrawing(0)
    }
  }

  useEffect(() => {
    // drawingの開始時間を変更すると、再生中の時間がずれるので停止して初期位置に戻す
    if (preStartElapsedTimeRef.current !== startElapsedTime) {
      preStartElapsedTimeRef.current = startElapsedTime
      stopPlaying()
      elapsedTimeRef.current = startElapsedTime
      updatePlayerElapsedTime()
    }
  }, [startElapsedTime, stopPlaying, updatePlayerElapsedTime])

  return { avatarRef, drawingRef, isPlaying, isPlayerHover, isAvatarLoading, playerElapsedTime, embedding, graphic, subtitle,
    setIsPlaying, startPlaying, stopPlaying, getElapsedTime, resetBeforeUndo, handleMouseOver, handleMouseLeave, handleSeekChange }
}