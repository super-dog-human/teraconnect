import { useState } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { deepCopy } from '../../../utils'

export default function useDrawingConfig({ index, initialConfig, closeCallback }) {
  const [isRecording, setIsRecording] = useState(false)
  const { drawings, updateLine } = useLessonEditorContext()
  const [config, setConfig] = useState(initialConfig)
  const [previewDrawings, setPreviewDrawings] = useState(deepCopy(drawings))

  function handleConfirm() {
    updateDrawing()
    closeCallback()
  }

  function updateDrawing() {
    const drawing = previewDrawings.filter(d => d.elapsedTime === initialConfig.elapsedTime)[index]

    // フッターで開始時間が変更されている場合、再収録した各untisの各時間にも反映する
    const diffTime = config.elapsedTime - initialConfig.elapsedTime
    if (diffTime !== 0 ) {
      drawing.units.forEach(u => u.elapsedTime = parseFloat((u.elapsedTime + diffTime).toFixed(3)))
    }

    config.units = drawing.units
    config.durationSec = drawing.durationSec

    updateLine('drawing', index, initialConfig.elapsedTime, config)
  }

  return { config, setConfig, previewDrawings, setPreviewDrawings, isRecording, setIsRecording, handleConfirm }
}