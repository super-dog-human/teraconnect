import React, { useState, useEffect } from 'react'
import LessonEditSpeechButton from './speechButton'
import LessonEditSpeechInputText from './speechInputText'
import EditIcon from './editIcon'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'
import { findNextElement } from '../../../../libs/utils'

export default function LessonEditLineSpeech({ speech, index, isEditButtonShow }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState()
  const { addSpeechLine } = useLessonEditorContext()

  function handleClick(e) {
    if (!audio && !speech.url && speech.text) {
      setIsLoading(true)
      const synthesisURL = '' // 自動合成音声を取得してurlにする
      createAudio(synthesisURL)
      setIsLoading(false)
    }

    if (audio.paused || audio.ended) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }

    e.stopPropagation()
  }

  function createAudio(voiceURL) {
    const audio = new Audio(voiceURL)
    audio.onended = () => setIsPlaying(false)
    setAudio(audio)
  }

  function handleKeyDown(e) {
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

  function handleChange(e) {
    // console.log(e.target.value)
    // speechesを更新する
    // setSpeeches()
    // setTimeline()
  }

  function handleEditButtonClick(e) {
    console.log('editbutton clicked.')
    e.stopPropagation()
  }

  useEffect(() => {
    if (!speech.url) return
    createAudio(speech.url)
  }, [speech])


  return (
    <>
      <LessonEditSpeechButton kind="speech" isPlaying={isPlaying} onClick={handleClick} />
      <LessonEditSpeechInputText onKeyDown={handleKeyDown} onChange={handleChange} defaultValue={speech.subtitle} readOnly={isLoading} draggable={false} isFocus={speech.isFocus} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}
