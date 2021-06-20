import React from 'react'
import KindButton from './kindButton'
import SpeechInputText from './speechInputText'
import EditIcon from './editIcon'
import useSpeechLine from '../../../../libs/hooks/lesson/edit/useSpeechLine'

export default function LessonLineSpeech({ speech, index, handleEditClick, isEditButtonShow }) {
  const { isLoading, isPlaying, inputRef, status, handleSpeechButtonClick, handleEditButtonClick, handleInputKeyDown, handleTextBlur } = useSpeechLine({ speech, index, handleEditClick })

  return (
    <>
      <KindButton kind='speech' isLoading={isLoading} isPlaying={isPlaying} status={status} onClick={handleSpeechButtonClick} />
      <SpeechInputText onKeyDown={handleInputKeyDown} onBlur={handleTextBlur}
        defaultValue={speech.subtitle} readOnly={isLoading} draggable={false} shouldFocus={speech.isFocus} ref={inputRef} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}