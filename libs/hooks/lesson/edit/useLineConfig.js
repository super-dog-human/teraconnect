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
        position: { x: targetRect.x + 10, y: targetRect.y + window.scrollY + 30 },
      })
    } else {
      setContextMenu({
        labels: ['編集', '行の追加', '削除'],
        actions: [editLine, addNewLine, deleteCurrentLine],
        position: { x: targetRect.x + 10, y: targetRect.y + window.scrollY + 30 },
      })
    }

    function editLine() {
      setLineConfig({
        action: kind, line, index, closeCallback
      })
    }

    function addNewLine() {
      setLineConfig({
        action: 'newLine', index, closeCallback
      })
    }

    function deleteCurrentLine() {
      console.log(kind, line.elapsedTime)
      showDialog({
        title: '削除の確認',
        message: '行を削除しますか？',
        canDismiss: true,
        dismissName: 'キャンセル',
        callbackName: '削除する',
        callback: () => deleteLine(kind, index, line.elapsedTime),
      })
    }

    function closeCallback() {
      setLineConfig({})
    }
  }

  return { handleEditButtonClick, lineConfig }
}