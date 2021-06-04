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
  embeddings: [],
  graphics: [],
  graphicURLs: [],
  drawings: [],
  musics: [],
  musicURLs: [],
  speeches: [],
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
  const { fetchResources, isLoading, durationSec, timeline, voiceSynthesisConfig, setVoiceSynthesisConfig, bgImageURL, setBgImageURL,
    avatars, embeddings, graphics, graphicURLs, drawings, musics, musicURLs, speeches, setEmbeddings, setGraphics, setGraphicURLs, updateLine, deleteLine, swapLine,
    addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast } = useLessonEditor()

  return (
    <LessonEditorContext.Provider value={{
      fetchResources, isLoading, durationSec, timeline, voiceSynthesisConfig, setVoiceSynthesisConfig, bgImageURL, setBgImageURL,
      avatars, embeddings, graphics, graphicURLs, drawings, musics, musicURLs, speeches, setEmbeddings, setGraphics, setGraphicURLs, updateLine, deleteLine, swapLine,
      addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addMusicLine, addSpeechLine, addSpeechLineToLast
    }}>
      {children}
    </LessonEditorContext.Provider>
  )
}

const useLessonEditorContext = () => useContext(LessonEditorContext)

export { LessonEditorProvider, useLessonEditorContext }