import React from 'react'
import LessonEditSpeechButton from './speechButton'
import LessonEditSpeechInputText from './speechInputText'
import EditIcon from './editIcon'
import useSpeechController from '../../../../libs/hooks/lesson/edit/useSpeechController'

export default function LessonEditLineSpeech({ speech, lineIndex, kindIndex, isEditButtonShow }) {
  const { isLoading, isPlaying, handleSpeechClick, handleInputKeyDown, handleTextChange, handleEditButtonClick } =
    useSpeechController({ speech, lineIndex, kindIndex })

  return (
    <>
      <LessonEditSpeechButton kind="speech" isLoading={isLoading} isPlaying={isPlaying} onClick={handleSpeechClick} />
      <LessonEditSpeechInputText onKeyDown={handleInputKeyDown} onChange={handleTextChange}
        defaultValue={speech.subtitle} readOnly={isLoading} draggable={false} isFocus={speech.isFocus} />
      <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
    </>
  )
}
