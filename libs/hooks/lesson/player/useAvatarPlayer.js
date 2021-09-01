import { useState, useRef, useCallback, useEffect } from 'react'
import { Vector3 }  from 'three'
import useAvatar from '../useAvatar'
import { equalArrays } from '../../../utils'

export default function useAvatarPlayer({ isPlaying, isLoading, setIsLoading, startElapsedTime, durationSec, hasResize, avatar, avatarLightColor, avatars, speeches }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [shouldUpdateAvatar, setShouldUpdateAvatar] = useState(false)
  const preMovingRef = useRef()
  const prePositiosnRef = useRef([])
  const { setAvatarConfig, avatarRef, setPosition, resetPosition, startMoving, stopMoving } = useAvatar({ setIsLoading, isSpeaking, hasResize })
  const elapsedTimeRef = useRef(startElapsedTime)

  function initializeAvatar() {
    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      elapsedTimeRef.current = startElapsedTime
      stopMoving()
      resetPosition(avatar)
    }
  }

  const updateAvatar = useCallback(incrementalTime => {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    const reversedAvatars = avatars.slice().reverse()
    const indexFromLast = reversedAvatars.findIndex(a => a.elapsedTime <= newElapsedTime && a.elapsedTime + a.durationSec >= newElapsedTime)
    const newMoving = reversedAvatars[indexFromLast]
    const lastMoving = reversedAvatars[indexFromLast + 1]

    if (newMoving && preMovingRef.current !== newMoving) {
      let startPositions
      if (preMovingRef.current) {
        startPositions = preMovingRef.current.positions
      } else if (lastMoving) {
        startPositions = lastMoving.positions
      } else {
        startPositions = avatar.config.positions
      }

      const realDurationSec = newMoving.elapsedTime + newMoving.durationSec - newElapsedTime
      const startVector = new Vector3(...startPositions)
      const destinationVector = new Vector3(...newMoving.positions)

      startVector.lerp(destinationVector, 1 - realDurationSec / newMoving.durationSec)
      startMoving(realDurationSec, Object.values(startVector), newMoving.positions)

      preMovingRef.current = newMoving
    } else if (newMoving && lastMoving) {
      // 自身の一つ前の移動後の位置
    } else {
      const lastMoving = reversedAvatars.find(a => a.elapsedTime + a.durationSec < newElapsedTime)
      if (lastMoving && !equalArrays(prePositiosnRef.current, lastMoving.positions)) {
        stopMoving()
        setPosition(lastMoving.positions)
        prePositiosnRef.current = lastMoving.positions
      }
    }

    const isSpeakingNow = speeches.some(speech => (
      speech.elapsedTime <= newElapsedTime && speech.elapsedTime + speech.durationSec >= newElapsedTime
    ))
    setIsSpeaking(isSpeakingNow)

    if (newElapsedTime < startElapsedTime + durationSec) {
      elapsedTimeRef.current = newElapsedTime
    } else {
      elapsedTimeRef.current = startElapsedTime + durationSec
      preMovingRef.current = null
      prePositiosnRef.current = []
    }
  }, [durationSec, startElapsedTime, avatars, avatar?.config?.positions, speeches, startMoving, stopMoving, setPosition])

  function seekAvatar(e) {
    elapsedTimeRef.current = startElapsedTime + parseFloat(e.target.value)
    preMovingRef.current = null
    prePositiosnRef.current = []
    stopMoving()
    resetPosition(avatar)
    updateAvatar(0)
  }

  useEffect(() => {
    if (isLoading) return
    if (!avatars) return
    if (isPlaying) {
      setAvatarConfig({ playAnimation: true })
    } else {
      setAvatarConfig({ stopAnimation: true })
    }
  }, [isLoading, isPlaying, avatars, setAvatarConfig])

  useEffect(() => {
    if (!shouldUpdateAvatar) return
    if (isLoading) return
    setShouldUpdateAvatar(false)
    updateAvatar(0)
  }, [avatars, isLoading, shouldUpdateAvatar, updateAvatar])

  useEffect(() => {
    if (!avatars || avatars.length === 0) return
    setShouldUpdateAvatar(true)
  }, [avatars])

  useEffect(() => {
    if (!avatar || !avatarLightColor) return
    setAvatarConfig({ avatar, lightColor: avatarLightColor  })
  }, [avatar, avatarLightColor, setAvatarConfig])

  return { avatarRef, initializeAvatar, updateAvatar, seekAvatar }
}