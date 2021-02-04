import React, { useState, useContext } from 'react'
import useTimeCounter from '../hooks/useTimeCounter'

const LessonRecorderContext = React.createContext({
  isRecording: false,
  setIsRecording: () => {},
  elapsedSeconds: 0,
  setRecord: () => {},
  switchCounter: () => {},
})

const LessonRecorderProvider = ({ children }) => {
  const [isRecording, setIsRecording] = useState(false)
  const { elapsedSeconds, realElapsedTime, switchCounter } = useTimeCounter()

  function setRecord(record) {
    // 完全に同じ時間なら、前の操作を上書きしていいものがある
    // 同じ操作を何回も行なった場合、最初のものしか記録しなくていい場合がある
    console.log(realElapsedTime(), record)
  }

  //  const { setRecord } = useRecorder(lesson.id, token, isRecording)

  return (
    <LessonRecorderContext.Provider value={{ isRecording, setIsRecording, elapsedSeconds, realElapsedTime, setRecord, switchCounter }}>
      {children}
    </LessonRecorderContext.Provider>
  )
}

const useLessonRecorderContext = () => useContext(LessonRecorderContext)

export { LessonRecorderProvider, useLessonRecorderContext }