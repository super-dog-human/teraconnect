import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useSynthesisVoice from '../../useSynthesisVoice'
import useAudioPlayer from '../../useAudioPlayer'
import { isBlobURL } from '../../../utils'
import { post, putFile } from '../../../fetch'
import { fetchVoiceFileURL } from '../../../fetchResource'
import { wavURLToMp3 } from '../../../audioUtils'

export default function useSpeechConfig({ lineIndex, kindIndex, initialConfig, closeCallback }) {
  const router = useRouter()
  const lessonIDRef = useRef()
  // propsをタブの初期値としてstateにコピーし、確定時にコピー元を更新する
  const [tabConfig, setTabConfig] = useState({ ...initialConfig, caption: { ...initialConfig.caption } })
  const [isProcessing, setIsProcessing] = useState(false)
  const { updateLine } = useLessonEditorContext()
  const { createSynthesisVoiceFile } = useSynthesisVoice()
  const { createAudio } = useAudioPlayer()

  async function handleConfirm() {
    setIsProcessing(true)

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
      }
    }

    if (tabConfig.url) {
      updateSpeechWithAudio(tabConfig)
    } else {
      updateSpeechWithoutAudio(tabConfig)
    }
  }

  function updateSpeechWithoutAudio(config) {
    config.durationSec = 0
    updateLine(lineIndex, kindIndex, 'speech', config)
    setIsProcessing(false)
    closeCallback()
  }

  function updateSpeechWithAudio(config) {
    // 音声の長さは読み込まないと分からないので以後の処理はコールバックになる
    createAudio(config.url, async (audio) => {
      config.durationSec = parseFloat(audio.duration.toFixed(3))
      if (!config.isSynthesis) {
        config.synthesisConfig = {} // 不要な設定の削除
      }

      if (isBlobURL(config.url)) {
        const voice = await createHumanVoice(config.url, config.elapsedtime, config.durationSec)
        config.url = ''
        config.voiceID = parseInt(voice.fileID)
      }

      updateLine(lineIndex, kindIndex, 'speech', config)
      setIsProcessing(false)
      closeCallback()
    })

    async function createHumanVoice(objectURL, elapsedtime, durationSec) {
      const mp3File = await wavURLToMp3(objectURL)
      const voice = await createVoice(elapsedtime, durationSec)
      await putFile(voice.signedURL, mp3File, mp3File.type)
      return voice
    }

    async function createVoice(elapsedtime, durationSec) {
      return await post('/voice', { elapsedtime, durationSec, lessonID: lessonIDRef.current })
    }
  }

  function handleClose() {
    closeCallback()
  }

  useEffect(() => {
    lessonIDRef.current = parseInt(router.query.id)
  }, [])

  return { isProcessing, tabConfig, setTabConfig, handleConfirm, handleClose }
}