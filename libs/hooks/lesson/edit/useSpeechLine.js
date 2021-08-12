import { useState, useRef, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAudioPlayer from '../../useAudioPlayer'
import useSynthesisVoice from '../../useSynthesisVoice'
import { findNextElement } from '../../../utils'
import { fetchVoiceFileURL } from '../../../fetchResource'
import { useRouter } from 'next/router'

export default function useSpeechLine({ speech, index, handleEditClick }) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const inputRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(true)
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()
  const { addSpeechLineToLast, updateLine, speechURLs, setSpeechURLs, generalSetting } = useLessonEditorContext()
  const { createSynthesisVoiceFile } = useSynthesisVoice(generalSetting.voiceSynthesisConfig)

  async function handleSpeechClick(text) {
    if (!isPlaying) {
      setIsLoading(true)
      await setAudioIfNeeded(text)
      setIsLoading(false)
    }
    switchAudio()
  }

  async function setAudioIfNeeded(text) {
    const url = speechURLs[speech.voiceID]
    if (url) {
      createAudio(url)
    } else if (!speech.voiceID && speech.isSynthesis && text) {
      await setNewSynthesisVoice(text)
    } else if (speech.voiceID) {
      const voice = await fetchVoiceFileURL(speech.voiceID, lessonIDRef.current)
      createAudio(voice.url)
      updateSpeechURL(null, { [speech.voiceID]: voice.url })
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

  async function setNewSynthesisVoice(text) {
    speech.subtitle = text
    const voice = await createSynthesisVoiceFile({ lessonID: lessonIDRef.current, subtitle: speech.subtitle, synthesisConfig: speech.synthesisConfig })
    updateSpeechURL(speech.voiceID, { [voice.id]: voice.url })

    createAudio(voice.url, async audio => {
      speech.durationSec = parseFloat(audio.duration.toFixed(3))
      speech.voiceID = voice.id
      updateLine({ kind: 'speech', index, elapsedTime: speech.elapsedTime, newValue: speech })
    })
  }

  function updateSpeechURL(oldID, newURL) {
    setSpeechURLs(urls => {
      delete urls[oldID]
      return { ...urls, ...newURL }
    })
  }

  async function handleTextBlur(e) {
    const text = e.target.value
    if (text === speech.subtitle) return

    speech.subtitle = text
    if (speech.isSynthesis && text) {
      setIsLoading(true)
      await setNewSynthesisVoice(text)
      setIsLoading(false)
    } else if (speech.isSynthesis) {
      updateSpeechURL(speech.voiceID)
      speech.durationSec = 0
      speech.voiceID = 0
      updateLine({ kind: 'speech', index, elapsedTime: speech.elapsedTime, newValue: speech })
    } else {
      updateLine({ kind: 'speech', index, elapsedTime: speech.elapsedTime, newValue: speech })
    }
  }

  function handleSpeechButtonClick() {
    if (!status) return
    handleSpeechClick(inputRef.current.value)
  }

  function handleEditButtonClick(e) {
    e.stopPropagation()

    speech.subtitle = inputRef.current.value
    handleEditClick(e, 'speech', index, speech)
  }

  useEffect(() => {
    if (speech.isSynthesis && speech.subtitle) {
      setStatus(true)
    } else if(!speech.isSynthesis && speech.voiceID) {
      setStatus(true)
    } else {
      setStatus(false)
    }
  }, [speech])

  return { isLoading, isPlaying, inputRef, status, handleSpeechButtonClick, handleEditButtonClick, handleSpeechClick, handleInputKeyDown, handleTextBlur }
}