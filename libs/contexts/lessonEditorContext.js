import React, { useContext } from 'react'
import useLessonEditor from '../hooks/lesson/edit/useLessonEditor'

const LessonEditorContext = React.createContext({
  isInitialLoading: null,
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
  setEmbeddings: () => {},
  setGraphics: () => {},
  setGraphicURLs: () => {},
  updateLine: () => {},
  deleteLine: () => {},
  addAvatarLine: () => {},
  addDrawingLine: () => {},
  addEmbeddingLine: () => {},
  addGraphicLine: () => {},
  addMusicLine: () => {},
  addSpeechLine: () => {},
  addSpeechLineToLast: () => {},
})

const LessonEditorProvider = ({ children }) => {
  const { isInitialLoading, lesson, fetchResources, durationSec, timeline, generalSetting, setGeneralSetting,
    avatars, embeddings, graphics, graphicURLs, drawings, musics, musicURLs, setMusicURLs, speeches, setEmbeddings, setGraphics, setGraphicURLs,
    updateLine, deleteLine, addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast } = useLessonEditor()

  return (
    <LessonEditorContext.Provider value={{
      isInitialLoading, lesson, fetchResources, durationSec, timeline, generalSetting, setGeneralSetting,
      avatars, embeddings, graphics, graphicURLs, drawings, musics, musicURLs, setMusicURLs, speeches, setEmbeddings, setGraphics, setGraphicURLs,
      updateLine, deleteLine, addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast
    }}>
      {children}
    </LessonEditorContext.Provider>
  )
}

const useLessonEditorContext = () => useContext(LessonEditorContext)

export { LessonEditorProvider, useLessonEditorContext }