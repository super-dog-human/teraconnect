import { useState, useReducer } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'

export default function useEmbeddingConfig({ index, initialConfig, closeCallback }) {
  const serviceOptions = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'geogebra', label: 'GeoGebra' },
  ]

  const { updateLine } = useLessonEditorContext()
  const [config, dispatchConfig] = useReducer(configReducer, initialConfig)
  const [isInvalidInput, setIsInvalidInput] = useState(!initialConfig.contentID || initialConfig.contentID.length < 11)

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'action':
      return { ...state, action: payload }
    case 'serviceName':
      if (payload === initialConfig.serviceName) {
        return { ...state, serviceName: payload, contentID: initialConfig.contentID }
      } else {
        return { ...state, serviceName: payload, contentID: '' }
      }
    case 'contentID':
      return { ...state, contentID: payload }
    default:
      throw new Error()
    }
  }

  function handleServiceChange(e) {
    dispatchConfig({ type: 'serviceName', payload: e.target.value })
  }

  function handleContentIDBlur(e) {
    const id = e.currentTarget.value

    if (id.length === 11) {
      setIsInvalidInput(false)
    } else {
      setIsInvalidInput(true)
    }
    dispatchConfig({ type: 'contentID', payload: id })
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    if (config.action === 'hide') {
      delete config.serviceName
      delete config.contentID
    }

    updateLine({ kind: 'embedding', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }
  return { config, dispatchConfig, serviceOptions, isInvalidInput, handleServiceChange, handleContentIDBlur, handleConfirm, handleCancel }
}