import { useState, useRef, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAudioPlayer from '../../useAudioPlayer'
import useSynthesisVoice from '../../useSynthesisVoice'
import { findNextInputElement } from '../../../utils'
import { useRouter } from 'next/router'
import { voiceURL } from '../../../speechUtils'

let globalFocus = {}

export default function useSpeechLine({ speech, index, lineIndex, handleEditClick, setIsLineProcessing, updateSpeechLine }) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const inputRef = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(true)
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()
  const { addSpeechLineToLast, generalSetting, timeline } = useLessonEditorContext()
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
    if (!speech.voiceID && speech.isSynthesis && text) {
      setIsLineProcessing(true)
      await setNewSynthesisVoice(text)
    } else if (speech.voiceID) {
      const url = voiceURL(lessonIDRef.current, speech.voiceID, speech.voiceFileKey)
      createAudio(url)
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

    findNextInputElement(current, 'text', inputs => {
      inputs[0].focus()
    })

    if (document.activeElement === e.target) {
      addSpeechLineToLast() // フォーカスが変わらなかったら最後の行なので、新しい行を追加する
      globalFocus = { index: 0, lineIndex: Object.keys(timeline).length }
    }
  }

  function handleInputChange(e) {
    globalFocus.text = e.target.value
  }

  async function setNewSynthesisVoice(text) {
    const voice = await createSynthesisVoiceFile({ lessonID: lessonIDRef.current, subtitle: text, synthesisConfig: speech.synthesisConfig })
    const url = voiceURL(lessonIDRef.current, voice.id, voice.fileKey)
    const newSpeech = { ...speech, subtitle:text, voiceID: voice.id, voiceFileKey: voice.fileKey }
    createAudio(url, async audio => {
      newSpeech.durationSec = parseFloat(audio.duration.toFixed(3))
      updateSpeechLine({ lineIndex, kindIndex: index, speech: newSpeech })
    })
  }

  async function handleInputBlur(e) {
    const text = e.target.value
    if (text === speech.subtitle) return

    setIsLineProcessing(true)
    const newSpeech = { ...speech }
    newSpeech.subtitle = text

    if (speech.isSynthesis && text) {
      setIsLoading(true)
      await setNewSynthesisVoice(text)
      setIsLoading(false)
    } else if (speech.isSynthesis) {
      newSpeech.durationSec = 0
      newSpeech.voiceID = 0
      newSpeech.voiceFileKey = ''
      updateSpeechLine({ lineIndex, kindIndex: index, speech: newSpeech })
    } else {
      updateSpeechLine({ lineIndex, kindIndex: index, speech: newSpeech })
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

  useEffect(() => {
    if (globalFocus.lineIndex === lineIndex && globalFocus.index === index) {
      inputRef.current.focus()
      globalFocus = {}
    }
  }, [index, lineIndex])

  return { isLoading, isPlaying, inputRef, status, handleSpeechButtonClick, handleEditButtonClick, handleSpeechClick, handleInputKeyDown, handleInputChange, handleInputBlur }
}