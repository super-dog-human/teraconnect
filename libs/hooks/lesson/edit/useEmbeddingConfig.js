import { useState, useEffect } from 'react'
import { deepCopy } from '../../../utils'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'

export default function useEmbeddingConfig({ index, initialConfig, closeCallback }) {
  const serviceOptions = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'geogebra', label: 'GeoGebra' },
  ]

  const { updateLine } = useLessonEditorContext()
  const [config, setConfig] = useState(deepCopy(initialConfig))
  const [action, setAction] = useState(initialConfig.action)
  const [serviceName, setServiceName] = useState(initialConfig.serviceName || 'youtube')
  const [contentID, setContentID] = useState(initialConfig.contentID || '')
  const [isInvalidInput, setIsInvalidInput] = useState(false)

  function handleServiceChange(e) {
    setServiceName(e.target.value)
  }

  function handleContentIDChange(e) {
    setContentID(e.currentTarget.value)
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    const newValue = {
      elapsedTime: config.elapsedTime,
      action,
      serviceName,
      contentID,
    }

    updateLine({ kind: 'embedding', index, elapsedTime: initialConfig.elapsedTime, newValue, changeAfterLineElapsedTime })
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }

  useEffect(() => {
    if (action === 'hide') return
    if (contentID.length === 11) {
      setIsInvalidInput(false)
    } else {
      setIsInvalidInput(true)
    }
  }, [contentID])

  useEffect(() => {
    // contentIDをクリアする
  }, [serviceName])

  return { config, setConfig, action, setAction, serviceName, serviceOptions, isInvalidInput, handleServiceChange, handleContentIDChange, handleConfirm, handleCancel }
}