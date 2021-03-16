import { useState } from 'react'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'

export default function useLineConfig() {
  const [menuOption, setMenuOption] = useState({})
  const [lineConfig, setLineConfig] = useState({})
  const { showDialog } = useDialogContext()
  const { deleteLine } = useLessonEditorContext()

  function handleEditButtonClick(e, kind, lineIndex, kindIndex, line) {
    switch(kind) {
    case 'avatar':
      setMenuOption({
        labels: ['編集', '行の追加', '削除'],
        actions: [editAvatar, addNewLine, deleteCurrentLine],
        position: { x: e.clientX, y: e.clientY },
      })
      return
    case 'drawing':
      setMenuOption({
        labels: ['編集', '行の追加', '削除'],
        actions: [editDrawing, addNewLine, deleteCurrentLine],
        position: { x: e.clientX, y: e.clientY },
      })
      return
    case 'graphic':
      setMenuOption({
        labels: ['編集', '行の追加', '削除'],
        actions: [editGraphic, addNewLine, deleteCurrentLine],
        position: { x: e.clientX, y: e.clientY },
      })
      return
    case 'music':
      setMenuOption({
        labels: ['編集', '行の追加', '削除'],
        actions: [editMusic, addNewLine, deleteCurrentLine],
        position: { x: e.clientX, y: e.clientY },
      })
      return
    case 'speech':
      setMenuOption({
        labels: ['編集', '分割', '行の追加', '削除'],
        actions: [editSpeech, separeteSpeech, addNewLine, deleteCurrentLine],
        position: { x: e.clientX, y: e.clientY },
      })
      return
    }

    function editAvatar() {

    }

    function editDrawing() {

    }

    function editGraphic() {

    }

    function editMusic() {

    }

    function editSpeech() {
      setLineConfig({
        kind: 'speech',
        line,
        lineIndex,
        kindIndex,
      })
    }

    function separeteSpeech() {
      setLineConfig({
        kind: 'speech',
        line,
        lineIndex,
        kindIndex,
      })
    }

    function addNewLine() {

    }

    function deleteCurrentLine() {
      showDialog({
        title: '削除の確認',
        message: 'この行を削除しますか？',
        canDismiss: true,
        dismissName: 'キャンセル',
        callbackName: '削除する',
        callback: () => deleteLine(lineIndex, kindIndex, kind),
      })
    }
  }

  return { handleEditButtonClick, menuOption, lineConfig }
}