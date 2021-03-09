import React, { useContext } from 'react'
import useLessonEditor from '../hooks/lesson/edit/useLessonEditor'

const LessonEditorContext = React.createContext({
  fetchResources: () => {},
  isLoading: true,
  durationSec: null,
  timeline: {},
  avatars: [],
  graphics: [],
  drawings: [],
  speeches: [],
  setGraphics: () => {},
  updateLine: () => {},
  swapLine: () => {},
  addSpeechLine: () => {},
})

const LessonEditorProvider = ({ children }) => {
  const { fetchResources, isLoading, durationSec, timeline, avatars, graphics, drawings, speeches,
    setGraphics, updateLine, swapLine, addSpeechLine } = useLessonEditor()

  return (
    <LessonEditorContext.Provider value={{
      fetchResources, isLoading, durationSec, timeline, avatars, graphics, drawings, speeches,
      setGraphics, updateLine, swapLine, addSpeechLine
    }}>
      {children}
    </LessonEditorContext.Provider>
  )
}

const useLessonEditorContext = () => useContext(LessonEditorContext)

export { LessonEditorProvider, useLessonEditorContext }