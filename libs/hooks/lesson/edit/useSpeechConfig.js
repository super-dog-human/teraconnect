import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useSynthesisVoice from '../../useSynthesisVoice'
import useAudioPlayer from '../../useAudioPlayer'
import { isBlobURL } from '../../../utils'
import fetch from 'isomorphic-unfetch'
import { putFile } from '../../../fetch'
import { fetchVoiceFileURL, createVoice } from '../../../fetchResource'
import { wavToMp3 } from '../../../audioUtils'

export default function useSpeechConfig({ lineIndex, kindIndex, initialConfig, closeCallback }) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const { showError } = useErrorDialogContext()
  // propsをタブの初期値としてstateにコピーし、確定時にコピー元を更新する
  const [tabConfig, setTabConfig] = useState({ ...initialConfig, caption: { ...initialConfig.caption } })
  const [isProcessing, setIsProcessing] = useState(false)
  const { updateLine } = useLessonEditorContext()
  const { createSynthesisVoiceFile } = useSynthesisVoice()
  const { createAudio } = useAudioPlayer()

  async function handleConfirm() {
    setIsProcessing(true)

    updateSpeech().catch(e => {
      setIsProcessing(false)
      showError({
        message: '音声データのURL生成に失敗しました。',
        original: e,
        canDismiss: true,
        callback: handleConfirm,
      })
    })
  }

  async function updateSpeech() {
    if (!tabConfig.url) {
      if (tabConfig.isSynthesis && tabConfig.subtitle) {
        const voice = await createSynthesisVoiceFile(lessonIDRef.current, tabConfig)
        tabConfig.voiceID = voice.id
        tabConfig.url = voice.url
      } else if (!tabConfig.isSynthesis && tabConfig.voiceID) {
        const voice = await fetchVoiceFileURL(tabConfig.voiceID, lessonIDRef.current)
        tabConfig.url = voice.url
      } else {
        // 合成だがsubtitleが未入力、または録音だがvoiceIDがない場合、声はなしになる
        tabConfig.voiceID = ''
        tabConfig.durationSec = 0
      }
    }

    if (tabConfig.url) {
      updateSpeechWithAudio(tabConfig)
    } else {
      updateSpeechWithoutAudio(tabConfig)
    }
  }

  function updateSpeechWithoutAudio(config) {
    updateLine(lineIndex, kindIndex, 'speech', config)
    setIsProcessing(false)
    closeCallback()
  }

  function updateSpeechWithAudio(config) {
    // 音声の長さは読み込まないと分からないので以後の処理はコールバックになる
    createAudio(config.url, async audio => {
      audioCallback(audio).catch(e => {
        showError({
          message: '音声データの変換に失敗しました。',
          original: e,
          canDismiss: true,
          callback: () => updateSpeechWithAudio(config),
        })
      })
    })

    async function audioCallback(audio) {
      config.durationSec = parseFloat(audio.duration.toFixed(3))
      if (!config.isSynthesis) {
        config.synthesisConfig = {} // 不要な設定の削除
      }

      if (isBlobURL(config.url)) {
        const voice = await createHumanVoice(config.url, config.elapsedtime, config.durationSec)
        URL.revokeObjectURL(config.url)
        config.url = ''
        config.voiceID = parseInt(voice.fileID)
      }

      updateLine(lineIndex, kindIndex, 'speech', config)
      setIsProcessing(false)
      closeCallback()
    }

    async function createHumanVoice(blobURL, elapsedtime, durationSec) {
      const file = await fetch(blobURL)
      const mp3File = (file.type === 'audio/mpeg') ? file : await wavToMp3(file)
      const voice = await createVoice(elapsedtime, durationSec, lessonIDRef.current)
      await putFile(voice.signedURL, mp3File, mp3File.type)
      return voice
    }
  }

  function handleClose() {
    closeCallback()
  }

  return { isProcessing, tabConfig, setTabConfig, handleConfirm, handleClose }
}