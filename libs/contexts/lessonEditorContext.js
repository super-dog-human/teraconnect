import React, { useContext } from 'react'
import useLessonEditor from '../hooks/lesson/edit/useLessonEditor'

const LessonEditorContext = React.createContext({
  lesson: {},
  fetchResources: () => {},
  durationSec: null,
  timeline: {},
  generalSetting: {},
  setGeneralSetting: () => {},
  avatars: [],
  embeddings: [],
  graphics: [],
  graphicURLs: [],
  drawings: [],
  musics: [],
  musicURLs: [],
  setMusicURLs: () => {},
  speeches: [],
  speechURLs: {},
  setSpeechURLs: () => {},
  setEmbeddings: () => {},
  setGraphics: () => {},
  setGraphicURLs: () => {},
  updateLine: () => {},
  deleteLine: () => {},
  swapLine: () => {},
  addAvatarLine: () => {},
  addDrawingLine: () => {},
  addEmbeddingLine: () => {},
  addGraphicLine: () => {},
  addMusicLine: () => {},
  addSpeechLine: () => {},
  addSpeechLineToLast: () => {},
})

const LessonEditorProvider = ({ children }) => {
  const { lesson, fetchResources, durationSec, timeline, generalSetting, setGeneralSetting,
    avatars, embeddings, graphics, graphicURLs, drawings, musics, musicURLs, setMusicURLs, speeches, speechURLs, setSpeechURLs, setEmbeddings, setGraphics, setGraphicURLs,
    updateLine, deleteLine, swapLine, addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast } = useLessonEditor()

  return (
    <LessonEditorContext.Provider value={{
      lesson, fetchResources, durationSec, timeline, generalSetting, setGeneralSetting,
      avatars, embeddings, graphics, graphicURLs, drawings, musics, musicURLs, setMusicURLs, speeches, speechURLs, setSpeechURLs, setEmbeddings, setGraphics, setGraphicURLs,
      updateLine, deleteLine, swapLine, addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast
    }}>
      {children}
    </LessonEditorContext.Provider>
  )
}

const useLessonEditorContext = () => useContext(LessonEditorContext)

export { LessonEditorProvider, useLessonEditorContext }