import { useState } from 'react'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'

export default function useLineConfig() {
  const [menuOption, setMenuOption] = useState({})
  const [lineConfig, setLineConfig] = useState({})
  const { showDialog } = useDialogContext()
  const { deleteLine } = useLessonEditorContext()

  function handleEditButtonClick(e, kind, lineIndex, kindIndex, line) {
    if (kind === 'speech') {
      setMenuOption({
        labels: ['編集', '分割', '行の追加', '削除'],
        actions: [editLine, separeteSpeech, addNewLine, deleteCurrentLine],
        position: { x: e.clientX, y: e.clientY },
      })
    } else {
      setMenuOption({
        labels: ['編集', '行の追加', '削除'],
        actions: [editLine, addNewLine, deleteCurrentLine],
        position: { x: e.clientX, y: e.clientY },
      })
    }

    function editLine() {
      setLineConfig({
        action: 'config', kind, line, lineIndex, kindIndex,
      })
    }

    function separeteSpeech() {
      setLineConfig({
        action: 'separate', kind: 'speech', line, lineIndex, kindIndex,
      })
    }

    function addNewLine() {
      setLineConfig({
        action: 'newLine', lineIndex, kindIndex,
      })
    }

    function deleteCurrentLine() {
      showDialog({
        title: '削除の確認',
        message: '行を削除しますか？',
        canDismiss: true,
        dismissName: 'キャンセル',
        callbackName: '削除する',
        callback: () => deleteLine(lineIndex, kindIndex, kind),
      })
    }
  }

  return { handleEditButtonClick, menuOption, lineConfig }
}