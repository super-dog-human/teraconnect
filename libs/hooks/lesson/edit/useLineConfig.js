import { useState, useRef } from 'react'

export default function useLineConfig() {
  const [menuOption, setMenuOption] = useState({})
  const [lineConfig, setLineConfig] = useState({})

  function handleEditButtonClick(e, kind, lineIndex, kindIndex, line) {
    console.log(e)
    switch(kind) {
    case 'avatar':
      return
    case 'drawing':
      return
    case 'graphic':
      return
    case 'music':
      return
    case 'speech':
      setMenuOption({
        labels: ['編集', '分割', '行の追加', '削除'],
        actions: [editSpeech, separeteSpeech, addNewLine, deleteLine],
        position: { x: e.clientX, y: e.clientY },
      })
      return
    }
  }

  function editSpeech() {
    setLineConfig({
      kind: 'speech',
    })
  }

  function separeteSpeech() {

  }

  function addNewLine() {

  }

  function deleteLine() {

  }

  return { handleEditButtonClick, menuOption, lineConfig }
}