import { useState } from 'react'
import { useRouter } from 'next/router'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAudioPlayer from '../../useAudioPlayer'
import { isBlobURL } from '../../../utils'
import { post, putFile } from '../../../fetch'
import { wavURLToMp3 } from '../../../audioUtils'

export default function useSpeechConfig({ lineIndex, kindIndex, initialConfig, closeCallback }) {
  const router = useRouter()
  // propsをタブの初期値としてstateにコピーし、確定時にコピー元を更新する
  const [tabConfig, setTabConfig] = useState({ ...initialConfig, caption: { ...initialConfig.caption } })
  const [isProcessing, setIsProcessing] = useState(false)
  const { updateLine } = useLessonEditorContext()
  const { createAudio } = useAudioPlayer()

  function handleConfirm() {
    setIsProcessing(true)

    // 音声の長さは読み込まないと分からないので以後の処理はコールバックになる
    createAudio(tabConfig.url, async (audio) => {
      tabConfig.durationSec = parseFloat(audio.duration.toFixed(3))

      if (isBlobURL(tabConfig.url)) {
        const voice = await createHumanVoice(tabConfig.url, tabConfig.elapsedtime, tabConfig.durationSec)
        tabConfig.url = ''
        tabConfig.voiceID = parseInt(voice.fileID)
      }

      if (!tabConfig.isSynthesis) {
        tabConfig.synthesisConfig = {} // 不要な設定の削除
      }

      updateLine(lineIndex, kindIndex, 'speech', tabConfig)
      closeCallback()
      setIsProcessing(false)
    })

    async function createHumanVoice(objectURL, elapsedtime, durationSec) {
      const mp3File = await wavURLToMp3(objectURL)
      const voice = await createVoice(elapsedtime, durationSec)
      await putFile(voice.signedURL, mp3File, mp3File.type)
      return voice
    }

    async function createVoice(elapsedtime, durationSec) {
      const lessonID = parseInt(router.query.id)
      return await post('/voice', { elapsedtime, durationSec, lessonID })
    }
  }

  function handleClose() {
    closeCallback()
  }

  return { isProcessing, tabConfig, setTabConfig, handleConfirm, handleClose }
}