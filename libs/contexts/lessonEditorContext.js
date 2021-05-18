import React, { useContext } from 'react'
import useLessonEditor from '../hooks/lesson/edit/useLessonEditor'

const LessonEditorContext = React.createContext({
  fetchResources: () => {},
  isLoading: true,
  durationSec: null,
  timeline: {},
  voiceSynthesisConfig: {},
  setVoiceSynthesisConfig: () => {},
  bgImageURL: '',
  setBgImageURL: () => {},
  avatars: [],
  graphics: [],
  graphicURLs: [],
  drawings: [],
  speeches: [],
  setGraphics: () => {},
  setGraphicURLs: () => {},
  updateLine: () => {},
  deleteLine: () => {},
  swapLine: () => {},
  addSpeechLineToLast: () => {},
})

const LessonEditorProvider = ({ children }) => {
  const { fetchResources, isLoading, durationSec, timeline, voiceSynthesisConfig, setVoiceSynthesisConfig, bgImageURL, setBgImageURL,
    avatars, graphics, graphicURLs, drawings, speeches, setGraphics, setGraphicURLs, updateLine, deleteLine, swapLine, addSpeechLineToLast } = useLessonEditor()

  return (
    <LessonEditorContext.Provider value={{
      fetchResources, isLoading, durationSec, timeline, voiceSynthesisConfig, setVoiceSynthesisConfig, bgImageURL, setBgImageURL,
      avatars, graphics, graphicURLs, drawings, speeches, setGraphics, setGraphicURLs, updateLine, deleteLine, swapLine, addSpeechLineToLast
    }}>
      {children}
    </LessonEditorContext.Provider>
  )
}

const useLessonEditorContext = () => useContext(LessonEditorContext)

export { LessonEditorProvider, useLessonEditorContext }