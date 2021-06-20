import { useState } from 'react'
import { useContextMenuContext } from '../../../contexts/contextMenuContext'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'

export default function useLineConfig() {
  const [lineConfig, setLineConfig] = useState({})
  const { showDialog } = useDialogContext()
  const { deleteLine } = useLessonEditorContext()
  const { setContextMenu } = useContextMenuContext()

  function handleEditButtonClick(e, kind, index, line) {
    const targetRect = e.currentTarget.getBoundingClientRect()
    if (kind === 'speech') {
      setContextMenu({
        labels: ['編集', '行の追加', '削除'],
        actions: [editLine, addNewLine, deleteCurrentLine],
        position: { fixed: false, x: targetRect.x + 10, y: targetRect.y + window.scrollY + 30 },
      })
    } else {
      setContextMenu({
        labels: ['編集', '行の追加', '削除'],
        actions: [editLine, addNewLine, deleteCurrentLine],
        position: { fixed: false, x: targetRect.x + 10, y: targetRect.y + window.scrollY + 30 },
      })
    }

    function editLine() {
      setLineConfig({
        action: kind, line, index
      })
    }

    function addNewLine() {
      setLineConfig({
        action: 'newLine', elapsedTime: line.elapsedTime
      })
    }

    function deleteCurrentLine() {
      showDialog({
        title: '行の削除',
        message: '行を削除しますか？',
        canDismiss: true,
        dismissName: 'キャンセル',
        callbackName: '削除する',
        callback: () => deleteLine(kind, index, line.elapsedTime),
      })
    }
  }

  function hasDoubleTimeError({ lastTimesRef, elapsedTime, kind, line }) {
    if (kind === 'drawing' && line.action === 'clear') {
      delete lastTimesRef.current.drawing
    }

    const hasError = (kind === 'speech' || line.action === 'draw') && lastTimesRef.current[kind] >= parseFloat(elapsedTime)
    const durationSec = line.durationSec || 0
    lastTimesRef.current[kind] = Math.max(lastTimesRef.current[kind] || 0, parseFloat(elapsedTime) + durationSec)

    return hasError
  }

  return { handleEditButtonClick, hasDoubleTimeError, lineConfig, setLineConfig }
}