import { useState } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'

export default function useDrawingConfig({ index, initialConfig, closeCallback }) {
  const [isRecording, setIsRecording] = useState(false)
  const { updateLine } = useLessonEditorContext()
  const [config, setConfig] = useState(initialConfig)

  function handleConfirm() {
    updateDrawing()
    closeCallback()
  }

  function updateDrawing() {
    updateLine('drawing', index, initialConfig.elapsedTime, config)
  }

  return { config, setConfig, isRecording, setIsRecording, handleConfirm }
}