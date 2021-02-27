import React, { useState, useEffect } from 'react'
import LessonEditSpeechButton from './speechButton'
import LessonEditSpeechInputText from './speechInputText'
import EditIcon from './editIcon'
import { findNextElement } from '../../../../libs/utils'

export default function LessonEditLineSpeech({ speech, index, isEditButtonShow }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState()

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
    if (e.keyCode != 13) return // 日本語の確定でEnterキーを押下した場合はスキップ

    let current = e.target.parentNode
    while(current.parentNode != null && current.parentNode != document.documentElement) {
      if (current.draggable) break
      current = current.parentNode
    }

    findNextElement(current.parentNode, 'input', inputs => {
      inputs[0].focus()
    })

    if (document.activeElement === e.target) {
      console.log('フォーカスが変わらなかったので行を追加する')
    }
  }

  function handleChange(e) {
    console.log(e.target.value)
    // speechesを更新する
    // setSpeeches()
    // setTimeline()
  }

  function handleEditButtonClick(e) {
    console.log('editbutton clicked.')
    e.stopPropagation()
  }

  const newSpeech = {
    voiceID: null,
    elapsedtime: 0,
    durationSec: 0,
    subtitle: '',
    caption: '',
    url: null,
  }

  useEffect(() => {
    if (!speech.url) return
    createAudio(speech.url)
  }, [speech])

  return (
    <>
      <LessonEditSpeechButton kind="speech" isPlaying={isPlaying} onClick={handleClick} />
      <LessonEditSpeechInputText onKeyDown={handleKeyDown} onChange={handleChange} value={speech.subtitle} readOnly={isLoading} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}
