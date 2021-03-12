import { useRef, useState } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { findNextElement } from '../../../utils'
import { post, fetchWithAuth } from '../../../fetch'

import { useRouter } from 'next/router'

export default function useSpeechController({ speech, lineIndex, kindIndex }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef()
  const { addSpeechLine, voiceSynthesisConfig, updateLine } = useLessonEditorContext()

  async function handleSpeechClick(e) {
    e.stopPropagation()

    setIsLoading(true)

    const lessonID = parseInt(router.query.id)

    if (speech.url) {
      createAudio(speech.url)
    } else if (speech.isSynthesis && speech.text) {
      console.log(speech.tex)
      const synthesisURL = await createVoiceFile(lessonID, speech)
      createAudio(synthesisURL)
      // updateLine
    } else if (!speech.isSynthesis) {
      const synthesisURL = await fetchVoiceFileURL(speech.voiceID, lessonID)
      createAudio(synthesisURL)
      // updateLine
    }

    setIsLoading(false)

    if (audioRef.current.paused || audioRef.current.ended) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  function fetchVoiceFileURL(voiceID, lessonID) {
    return fetchWithAuth(`/voices/${voiceID}?lesson_id=${lessonID}`)
      .then(result => result.url)
      .catch(e  => {
        console.error(e)
      })
  }

  function createVoiceFile(lessonID, speech) {
    const request = {
      'lessonID': lessonID,
      'text': speech.text,
      'languageCode': speech.synthesisConfig?.languageCode || voiceSynthesisConfig.languageCode,
      'name': speech.synthesisConfig?.name || voiceSynthesisConfig.name,
      'speakingRate': speech.synthesisConfig?.speakingRate || voiceSynthesisConfig.speakingRate,
      'pitch': speech.synthesisConfig?.pitch || voiceSynthesisConfig.pitch,
      'volumeGainDb': speech.synthesisConfig?.volumeGainDb || voiceSynthesisConfig.volumeGainDb,
    }

    console.log(request)

    return post('/synthesis_voice', request)
      .then(result => result.url)
      .catch(e  => {
        console.error(e)
      })
  }

  function createAudio(voiceURL) {
    const audio = new Audio(voiceURL)
    audio.onended = () => setIsPlaying(false)
    audioRef.current = audio
  }

  function handleInputKeyDown(e) {
    if (e.keyCode != 13) return // Enter以外のキーや、Enterでも日本語の確定でキーを押下した場合はスキップ

    let current = e.target.parentNode
    while(current.parentNode != null && current.parentNode != document.documentElement) {
      if (current.draggable) break
      current = current.parentNode
    }

    findNextElement(current, 'input', inputs => {
      inputs[0].focus()
    })

    if (document.activeElement === e.target) {
      addSpeechLine() // フォーカスが変わらなかったので新しい行を追加する
    }
  }

  function handleTextChange(e) {
    // console.log(e.target.value)
    // speechesを更新する
    // setSpeeches()
    // setTimeline()
  }

  function handleEditButtonClick(e) {
    console.log('editbutton clicked.')
    e.stopPropagation()
  }

  return { isLoading, isPlaying, handleSpeechClick, handleInputKeyDown, handleTextChange, handleEditButtonClick }
}