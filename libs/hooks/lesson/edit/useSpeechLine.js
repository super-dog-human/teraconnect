import { useState } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAudioPlayer from '../../useAudioPlayer'
import useSynthesisVoice from '../../useSynthesisVoice'
import { findNextElement } from '../../../utils'
import { fetchVoiceFileURL } from '../../../fetchResource'
import { useRouter } from 'next/router'

export default function useSpeechLine({ speech, index }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()
  const { addSpeechLineToLast, updateLine } = useLessonEditorContext()
  const { createSynthesisVoiceFile } = useSynthesisVoice()

  async function handleSpeechClick(text) {
    if (!isPlaying) {
      setIsLoading(true)
      await setAudioIfNeeded(text)
      setIsLoading(false)
    }
    switchAudio()
  }

  async function setAudioIfNeeded(text) {
    const lessonID = parseInt(router.query.id)

    if (speech.url) {
      createAudio(speech.url)
    } else if (speech.isSynthesis && text) {
      speech.subtitle = text
      const voice = await createSynthesisVoiceFile(lessonID, speech)
      createAudio(voice.url)
      speech.voiceID = voice.id
      speech.url = voice.url

      updateLine({ kind: 'speech', index, elapsedTime: speech.elapsedTime, newValue: speech })
    } else if (!speech.isSynthesis) {
      const voice = await fetchVoiceFileURL(speech.voiceID, lessonID)
      createAudio(voice.url)
      speech.url = voice.url

      updateLine({ kind: 'speech', index, elapsedTime: speech.elapsedTime, newValue: speech })
    }
  }

  function handleInputKeyDown(e) {
    if (e.keyCode !== 13) return // Enter以外のキーや、Enterでも日本語の確定でキーを押下した場合はスキップ
    // 'keyCode' はdeprecatedだがこれ以外の方法では日本語の確定を判断できなさそう

    let current = e.target.parentNode
    while (current.parentNode !== null && current.parentNode !== document.documentElement) {
      if (current.draggable) break
      current = current.parentNode
    }

    findNextElement(current, 'input', inputs => {
      inputs[0].focus()
    })

    if (document.activeElement === e.target) {
      addSpeechLineToLast() // フォーカスが変わらなかったら最後の行なので、新しい行を追加する
    }
  }

  function handleTextBlur(e) {
    const text = e.target.value
    if (text === speech.subtitle) return

    speech.subtitle = text
    if (speech.isSynthesis) speech.url = '' // テキストが更新されたら作成済みの音声も更新が必要なのでURLをクリア

    updateLine({ kind: 'speech', index, elapsedTime: speech.elapsedTime, newValue: speech })
  }

  return { isLoading, isPlaying, handleSpeechClick, handleInputKeyDown, handleTextBlur }
}