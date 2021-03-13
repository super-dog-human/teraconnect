import React, { useRef, useState, useEffect } from 'react'
import LessonEditSpeechButton from './speechButton'
import LessonEditSpeechInputText from './speechInputText'
import EditIcon from './editIcon'
import useSpeechController from '../../../../libs/hooks/lesson/edit/useSpeechController'

export default function LessonEditLineSpeech({ speech, lineIndex, kindIndex, isEditButtonShow }) {
  const { isLoading, isPlaying, handleSpeechClick, handleInputKeyDown, handleTextBlur, handleEditButtonClick } =
    useSpeechController({ speech, lineIndex, kindIndex })
  const inputRef = useRef()
  const [status, setStatus] = useState(true)

  function handleClick(e) {
    if (!status) return
    handleSpeechClick(inputRef.current.value)
  }

  useEffect(() => {
    if (speech.isSynthesis && speech.subtitle?.length > 0) {
      setStatus(true)
    } else if(!speech.isSynthesis && speech.voiceID) {
      setStatus(true)
    } else {
      setStatus(false)
    }
  }, [speech])

  return (
    <>
      <LessonEditSpeechButton kind="speech" isLoading={isLoading} isPlaying={isPlaying} status={status} onClick={handleClick} />
      <LessonEditSpeechInputText onKeyDown={handleInputKeyDown} onBlur={handleTextBlur}
        defaultValue={speech.subtitle} readOnly={isLoading} draggable={false} isFocus={speech.isFocus} ref={inputRef} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}
