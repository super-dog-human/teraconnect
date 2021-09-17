import { useState, useRef, useCallback, useEffect } from 'react'
import useAvatar from '../useAvatar'
import { equalArrays } from '../../../utils'

export default function useAvatarPlayer({ isPlaying, isLoading, setIsLoading, durationSec, elapsedTimeRef, hasResize, avatar, avatarLightColor, avatars, speeches }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [shouldUpdateAvatar, setShouldUpdateAvatar] = useState(false)
  const preMovingRef = useRef()
  const prePositiosnRef = useRef([])
  const { setAvatarConfig, avatarRef, cleanAvatar, setPosition, resetPosition, startMoving, stopMoving } = useAvatar({ setIsLoading, isSpeaking, hasResize })

  function initializeAvatar() {
    stopMoving()
    resetPosition(avatar)
  }

  const updateAvatar = useCallback(() => {
    const reversedAvatars = avatars.slice().reverse()
    const indexFromLast = reversedAvatars.findIndex(a => a.elapsedTime <= elapsedTimeRef.current && a.elapsedTime + a.durationSec >= elapsedTimeRef.current)
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

      const realDurationSec = newMoving.elapsedTime + newMoving.durationSec - elapsedTimeRef.current
      startMoving({ durationSec: newMoving.durationSec, realDurationSec, startPositions, destinationPositions: newMoving.positions, animations: avatar.config.walkingAnimations })
      preMovingRef.current = newMoving
    } else if (newMoving && lastMoving) {
      // 自身の一つ前の移動後の位置
    } else {
      const lastMoving = reversedAvatars.find(a => a.elapsedTime + a.durationSec < elapsedTimeRef.current)
      if (lastMoving && !equalArrays(prePositiosnRef.current, lastMoving.positions)) {
        stopMoving()
        setPosition(lastMoving.positions)
        prePositiosnRef.current = lastMoving.positions
      }
    }

    const isSpeakingNow = speeches.some(speech => (
      speech.elapsedTime <= elapsedTimeRef.current && speech.elapsedTime + speech.durationSec >= elapsedTimeRef.current
    ))
    setIsSpeaking(isSpeakingNow)

    if (elapsedTimeRef.current === durationSec) {
      preMovingRef.current = null
      prePositiosnRef.current = []
    }
  }, [durationSec, elapsedTimeRef, avatars, avatar?.config, speeches, startMoving, stopMoving, setPosition])

  function seekAvatar() {
    preMovingRef.current = null
    prePositiosnRef.current = []
    if (avatar) {
      stopMoving()
      resetPosition(avatar)
      updateAvatar(0)
    }
  }

  useEffect(() => {
    if (!avatar) cleanAvatar() // 別授業に遷移した際、以前のアバターをクリアする
  }, [avatar, cleanAvatar])

  useEffect(() => {
    if (isLoading) return
    if (!avatar) return
    if (!avatars) return
    if (isPlaying) {
      setAvatarConfig({ playAnimation: true })
    } else {
      setAvatarConfig({ stopAnimation: true })
    }
  }, [isLoading, isPlaying, avatar, avatars, setAvatarConfig])

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