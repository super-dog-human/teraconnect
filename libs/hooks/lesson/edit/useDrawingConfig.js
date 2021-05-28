import { useRef, useState } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { deepCopy } from '../../../utils'

export default function useDrawingConfig({ index, initialConfig, closeCallback }) {
  const startElapsedTimeRef = useRef(initialConfig.elapsedTime)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedAction, setSelectedAction] = useState(initialConfig.action)
  const { drawings, updateLine } = useLessonEditorContext()
  const [config, setConfig] = useState(initialConfig)
  const [previewDrawings, setPreviewDrawings] = useState(deepCopy(drawings))

  function handleCancel() {
    closeCallback(true)
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    updateDrawing(changeAfterLineElapsedTime)
    closeCallback()
  }

  function updateDrawing(changeAfterLineElapsedTime) {
    const drawing = previewDrawings.filter(d => d.elapsedTime === startElapsedTimeRef.current)[index]

    config.action = selectedAction

    if (config.action === 'draw') {
      // フッターで開始時間が変更されている場合、再収録した各untisの各時間にも反映する
      const diffTime = config.elapsedTime - startElapsedTimeRef.current
      if (diffTime !== 0 ) {
        drawing.units.forEach(u => u.elapsedTime = parseFloat((u.elapsedTime + diffTime).toFixed(3)))
      }

      config.units = drawing.units
      config.durationSec = drawing.durationSec
    } else {
      config.units = null
      config.durationSec = 0
    }

    updateLine({ kind: 'drawing', index, elapsedTime: startElapsedTimeRef.current, newValue: config, changeAfterLineElapsedTime })
  }

  return { config, setConfig, selectedAction, setSelectedAction, startElapsedTimeRef, previewDrawings, setPreviewDrawings, isRecording, setIsRecording, handleConfirm, handleCancel }
}