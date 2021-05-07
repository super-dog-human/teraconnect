import React, { useRef, useState, useEffect } from 'react'
import KindButton from './kindButton'
import SpeechInputText from './speechInputText'
import EditIcon from './editIcon'
import useSpeechLine from '../../../../libs/hooks/lesson/edit/useSpeechLine'

export default function LessonLineSpeech({ speech, index, isEditButtonShow, handleEditClick }) {
  const { isLoading, isPlaying, handleSpeechClick, handleInputKeyDown, handleTextBlur } = useSpeechLine({ speech, index })
  const inputRef = useRef()
  const [status, setStatus] = useState(true)

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

  return (
    <>
      <KindButton kind='speech' isLoading={isLoading} isPlaying={isPlaying} status={status} onClick={handleSpeechButtonClick} />
      <SpeechInputText onKeyDown={handleInputKeyDown} onBlur={handleTextBlur}
        defaultValue={speech.subtitle} readOnly={isLoading} draggable={false} isFocus={speech.isFocus} ref={inputRef} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}