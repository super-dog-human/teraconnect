import { useRef, useState, useEffect } from 'react'
import { isBlobURL } from '../../../utils'
import fetch from 'isomorphic-unfetch'
import { wavToMp3 } from '../../../audioUtils'

const maxFileByteSize = 10485760 // 10MB

export default function useHumanVoiceFileController(config, setConfig, inputFileRef) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [contextMenu, setContextMenu] = useState({})
  const [disableMenuIndexes, setDisableMenuIndexes] = useState([1]) // 初期状態では「ダウンロード」を選択できない

  function handleMoreButtonClick(e) {
    setContextMenu({
      labels: ['アップロード', 'ダウンロード'],
      actions: [openFileSelector, downloadVoice],
      position: { x: 0, y: e.currentTarget.getBoundingClientRect().top },
      disableMenuIndexes,
    })

    function openFileSelector() {
      inputFileRef.current.click()
    }

    async function downloadVoice() {
      if (isProcessing) return

      setIsProcessing(true)

      const link = document.createElement('a')
      link.download = 'voice'

      const file = await fetch(config.url)
      if (file.type === 'audio/mpeg') {
        link.href = config.url
      } else {
        const url = URL.createObjectURL(await wavToMp3(file))
        link.href = url
      }
      link.click()

      setIsProcessing(false)
    }
  }

  function handleFileChange(e) {
    swapVoice(e.target.files[0])
    e.target.value = ''
  }

  function swapVoice(file) {
    if (isProcessing) return

    setIsProcessing(true)
    if (file.type != 'audio/mpeg') return
    if (file.size > maxFileByteSize) return

    if (config.url && isBlobURL(config.url)) {
      URL.revokeObjectURL(config.url)
    }

    setConfig(config => {
      config.url = URL.createObjectURL(file)
      config.voiceID = ''
      return { ...config }
    })

    setIsProcessing(false)
  }

  useEffect(() => {
    if (!config.url) return
    setDisableMenuIndexes([]) // 録音によりaudioURLが発行されたら、「ダウンロード」が選択可能になる
  }, [config])

  return { contextMenu, handleMoreButtonClick, handleFileChange }
}