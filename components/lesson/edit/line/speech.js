import React, { useRef, useState, useEffect } from 'react'
import LessonEditSpeechButton from './speechButton'
import LessonEditSpeechInputText from './speechInputText'
import EditIcon from './editIcon'
import useSpeechLine from '../../../../libs/hooks/lesson/edit/useSpeechLine'

export default function LessonLineSpeech({ speech, lineIndex, kindIndex, isEditButtonShow, handleEditClick }) {
  const { isLoading, isPlaying, handleSpeechClick, handleInputKeyDown, handleTextBlur } = useSpeechLine({ speech, lineIndex, kindIndex })
  const inputRef = useRef()
  const [status, setStatus] = useState(true)

  function handleSpeechButtonClick(e) {
    if (!status) return
    handleSpeechClick(inputRef.current.value)
  }

  function handleEditButtonClick(e) {
    e.stopPropagation()

    speech.subtitle = inputRef.current.value
    handleEditClick(e, 'speech', lineIndex, kindIndex, speech)
  }

  useEffect(() => {
    if (speech.isSynthesis && speech.subtitle) {
      setStatus(true)
    } else if(!speech.isSynthesis) {
      setStatus(true)
    } else {
      setStatus(false)
    }
  }, [speech])

  return (
    <>
      <LessonEditSpeechButton kind="speech" isLoading={isLoading} isPlaying={isPlaying} status={status} onClick={handleSpeechButtonClick} />
      <LessonEditSpeechInputText onKeyDown={handleInputKeyDown} onBlur={handleTextBlur}
        defaultValue={speech.subtitle} readOnly={isLoading} draggable={false} isFocus={speech.isFocus} ref={inputRef} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}