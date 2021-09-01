import { useState, useReducer, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAvatar from '../../../hooks/lesson/useAvatar'
import { deepCopy } from '../../../utils'

export default function useAvatarConfig({ index, initialConfig, closeCallback }) {
  const [config, dispatchConfig] = useReducer(configReducer, initialConfig)
  const [durationSec, setDurationSec] = useState(initialConfig.durationSec)
  const [isLoading, setIsLoading] = useState(true)
  const { generalSetting, avatars, updateLine } = useLessonEditorContext()
  const { setAvatarConfig, avatarRef, startDragging, inDragging, endDragging } = useAvatar({ setIsLoading, movingCallback })

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'positions':
      return { ...state, positions: payload.positions, durationSec: payload.durationSec }
    default:
      throw new Error()
    }
  }

  async function initAvatar() {
    const avatar = deepCopy(generalSetting.avatar)
    if (config.positions) {
      avatar.config.positions = config.positions
    } else {
      const lastAvatar = justBeforeAvatar()
      if (lastAvatar) {
        avatar.config.positions = lastAvatar.positions
      }
    }
    setAvatarConfig({ avatar, lightColor: generalSetting.avatarLightColor })
    dispatchConfig({ type: 'positions', payload: { positions: avatar.config.positions, durationSec: initialConfig.durationSec } })
  }

  function movingCallback(record) {
    const durationSec = record.durationMillisec / 1000
    setDurationSec(durationSec)
    dispatchConfig({ type: 'positions', payload: { positions: record.value, durationSec } })
  }

  function justBeforeAvatar() {
    if (index > 0) {
      return avatars.filter(a => a.elapsedTime === initialConfig.elapsedTime)[index - 1]
    } else {
      return avatars.slice().reverse().find(a => a.elapsedTime < initialConfig.elapsedTime)
    }
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

  return { config, dispatchConfig, isLoading, avatarRef, durationSec, startDragging, inDragging, endDragging, handleDurationChange, handleConfirm, handleCancel }
}