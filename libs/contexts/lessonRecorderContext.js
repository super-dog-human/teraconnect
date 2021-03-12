import React, { useContext } from 'react'
import useLessonRecorder from '../hooks/lesson/record/useLessonRecorder'

const LessonRecorderContext = React.createContext({
  isRecording: false,
  setIsRecording: () => {},
  isFinishing: false,
  elapsedSeconds: 0,
  setRecord: () => {},
  switchCounter: () => {},
  finishRecording: () => {},
})

const LessonRecorderProvider = ({ children }) => {
  const { isRecording, setIsRecording, isFinishing, elapsedSeconds, realElapsedTime, setRecord, switchCounter, finishRecording } = useLessonRecorder()
  return (
    <LessonRecorderContext.Provider value={{ isRecording, setIsRecording, isFinishing, elapsedSeconds, realElapsedTime, setRecord, switchCounter, finishRecording }}>
      {children}
    </LessonRecorderContext.Provider>
  )
}

const useLessonRecorderContext = () => useContext(LessonRecorderContext)

export { LessonRecorderProvider, useLessonRecorderContext }