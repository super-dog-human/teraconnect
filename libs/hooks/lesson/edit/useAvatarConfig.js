import { useState, useReducer, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAvatar from '../../../hooks/lesson/useAvatar'

export default function useAvatarConfig({ index, initialConfig, closeCallback }) {
  const [config, dispatchConfig] = useReducer(configReducer, initialConfig)
  const [durationSec, setDurationSec] = useState(initialConfig.durationSec)
  const [isLoading, setIsLoading] = useState(true)
  const { generalSetting, updateLine } = useLessonEditorContext()
  const { setAvatarConfig, avatarRef, startDragging, inDragging, endDragging } = useAvatar({ setIsLoading, movingCallback })

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'durationSec':
      return { ...state, durationSec: payload }
    case 'moving':
      return { ...state, moving: payload.moving, durationSec: payload.durationSec }
    default:
      throw new Error()
    }
  }

  async function initAvatar() {
    const avatar = { ...generalSetting.avatar }
    avatar.config.positions = Object.values(config.moving)
    setAvatarConfig({ avatar, lightColor: generalSetting.avatarLightColor })
  }

  function movingCallback(record) {
    const durationSec = record.durationMillisec / 1000
    setDurationSec(durationSec)
    dispatchConfig({ type: 'moving', payload: { moving: record.value } })
  }

  function handleDurationChange(e) {
    let durationSec
    if (!e.target.value) {
      durationSec = 0
    } else if (parseFloat(e.target.value) <= 60.0) {
      durationSec = Math.floor(e.target.value * 1000) / 1000
    } else {
      return false
    }
    e.target.value = durationSec
    setDurationSec(durationSec)
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    updateLine({ kind: 'avatar', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }

  useEffect(() => {
    initAvatar()
  }, [])

  useEffect(() => {
    dispatchConfig({ type: 'durationSec', payload: durationSec })
  }, [durationSec])

  return { config, dispatchConfig, isLoading, avatarRef, durationSec, startDragging, inDragging, endDragging, handleDurationChange, handleConfirm, handleCancel }
}