import { useRef, useState, useCallback, useEffect } from 'react'
import usePlayerController from './usePlayerController'
import useAvatarPlayer from './player/useAvatarPlayer'
import useDrawingPlayer from './useDrawingPlayer'
import useGeoGebraPlayer from './player/useGeoGebraPlayer'
import useGraphicPlayer from './player/useGraphicPlayer'
import useSubtitlePlayer from './player/useSubtitlePlayer'
import { useUnmount } from 'react-use'

export default function useLessonPlayer({ startElapsedTime=0, durationSec, hasResize, avatar, avatarLightColor, avatars, drawings, embeddings, graphics, speeches, graphicURLs, sameTimeIndex, updateSpeeches, updateMusics, updateYouTube }) {
  const animationIDRef = useRef(0)
  const elapsedTimeRef = useRef(startElapsedTime)
  const preStartElapsedTimeRef = useRef(startElapsedTime)
  const [isAvatarLoading, setIsAvatarLoading] = useState(!!avatars)
  const { isPlaying, setIsPlaying, playerElapsedTime, setPlayerElapsedTime, deltaTime, resetClock, switchClock } = usePlayerController()
  const { avatarRef, initializeAvatar, updateAvatar, seekAvatar } = useAvatarPlayer({ isPlaying, isLoading: isAvatarLoading, setIsLoading: setIsAvatarLoading, durationSec, elapsedTimeRef, hasResize, avatar, avatarLightColor, avatars, speeches })
  const { drawingRef, updateDrawing, initializeDrawing, seekDrawing, resetBeforeUndo } = useDrawingPlayer({ drawings, sameTimeIndex, durationSec, startElapsedTime, elapsedTimeRef })
  const { geoGebra, seekEmbedding, updateGeoGebra } = useGeoGebraPlayer({ elapsedTimeRef, embeddings })
  const { graphic, updateGraphic, seekGraphic } = useGraphicPlayer({ elapsedTimeRef, graphics, graphicURLs })
  const { subtitle, updateSubtitle, seekSubtitle } = useSubtitlePlayer({ elapsedTimeRef, speeches })

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
      if (avatar && avatars) initializeAvatar()
      if (drawings) initializeDrawing()
    }

    playFrame()
  }

  const stopPlaying = useCallback(() => {
    setIsPlaying(false)
    switchClock(false)

    if (animationIDRef.current !== 0) {
      cancelAnimationFrame(animationIDRef.current)
      animationIDRef.current = 0
    }
  }, [setIsPlaying, switchClock])

  function playFrame() {
    let incrementalTime = deltaTime()

    if (elapsedTimeRef.current + incrementalTime - startElapsedTime > durationSec) {
      incrementalTime = startElapsedTime + durationSec - elapsedTimeRef.current // 経過時間の積算が収録時間を超えてしまう場合の調整
    } else {
      animationIDRef.current = requestAnimationFrame(playFrame)
    }

    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    if (newElapsedTime <= startElapsedTime + durationSec) {
      elapsedTimeRef.current = newElapsedTime

      if (avatar && avatars) updateAvatar()
      if (drawings) updateDrawing()
      if (embeddings) updateGeoGebra()
      if (graphics) updateGraphic()
      if (speeches) updateSubtitle()
      if (updateSpeeches) updateSpeeches(incrementalTime)
      if (updateMusics) updateMusics(incrementalTime)
      if (updateYouTube) updateYouTube(incrementalTime)
      updatePlayerElapsedTime()
    }

    if (elapsedTimeRef.current === startElapsedTime + durationSec) {
      finishPlaying()
    }
  }

  function finishPlaying() {
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

    if (avatar && avatars) seekAvatar()
    if (drawings) seekDrawing()
    if (embeddings) seekEmbedding()
    if (graphics) seekGraphic()
    if (speeches) seekSubtitle()

    elapsedTimeRef.current = elapsedTime
    updatePlayerElapsedTime()

    if (shouldResume) {
      startPlaying()
    } else {
      updateDrawing(0)
    }
  }

  const initializeElapsedTime = useCallback(() => {
    // 初回読み込み時は必要ないが、別の授業に遷移した場合に経過時間のリセットが必要になる
    elapsedTimeRef.current = startElapsedTime
    setPlayerElapsedTime(0)
    seekAvatar()
    seekDrawing()
    seekEmbedding()
    seekGraphic()
    seekSubtitle()
  }, [elapsedTimeRef, startElapsedTime, setPlayerElapsedTime, seekAvatar, seekDrawing, seekEmbedding, seekGraphic, seekSubtitle])

  useEffect(() => {
    // drawingの開始時間を変更すると、再生中の時間がずれるので停止して初期位置に戻す
    if (preStartElapsedTimeRef.current !== startElapsedTime) {
      preStartElapsedTimeRef.current = startElapsedTime
      stopPlaying()
      elapsedTimeRef.current = startElapsedTime
      updatePlayerElapsedTime()
    }
  }, [startElapsedTime, stopPlaying, updatePlayerElapsedTime])

  return { avatarRef, drawingRef, isPlaying, isAvatarLoading, playerElapsedTime, geoGebra, graphic, subtitle,
    setIsPlaying, startPlaying, stopPlaying, getElapsedTime, initializeElapsedTime, resetBeforeUndo, handleSeekChange }
}