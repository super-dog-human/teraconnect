import { filterObject } from './utils'
import { createTimeline } from './lessonLineUtils'

export async function fetchMaterial({ lesson, materialRef, fetchWithAuth, setVoiceSynthesisConfig, setBgImageURL, setAvatarLightColor, setAvatars, setDrawings, setEmbeddings, setGraphics, setGraphicURLs, setMusics, setSpeeches }) {
  const material = await fetchWithAuth(`/lessons/${lesson.id}/materials`)
  materialRef.current = { id: material.id, created: material.created, updated: material.updated }

  setBgImageURL(material.backgroundImageURL)
  setVoiceSynthesisConfig(material.voiceSynthesisConfig)
  setAvatarLightColor(material.avatarLightColor)
  setAvatars(material.avatars || [])
  setDrawings(material.drawings || [])
  setEmbeddings(material.embeddings || [])
  setGraphics(material.graphics || [])
  setMusics(material.musics || [])

  await fetchAndSetGraphicURLs()
  await fetchAnsSetSpeechWithVoice(material)
  return createTimeline(filterObject(material, ['avatars', 'drawings', 'embeddings', 'graphics', 'speeches', 'musics']))

  async function fetchAndSetGraphicURLs() {
    const graphicURLs = (await fetchGraphicURLs()).reduce((acc, r) => {
      acc[r.id] = {
        url: r.url,
        isUploading: false,
      }
      return acc
    }, {})

    setGraphicURLs(graphicURLs)
  }

  async function fetchAnsSetSpeechWithVoice(material) {
    const conditions = [!material.speeches, lesson.needsRecording, material.created === material.updated]
    if (conditions.every(v => v)) {
      const voices = await fetchWithAuth(`/voices?lesson_id=${lesson.id}`)
        .catch(e => {
          if (e.response?.status === 404) return []
          throw e
        })
      const speeches = []

      voices.forEach(v => {
        const newSpeech = {}
        newSpeech.isSynthesis = false
        newSpeech.caption = {}
        newSpeech.voiceID = v.id
        newSpeech.elapsedTime = v.elapsedTime
        newSpeech.durationSec = v.durationSec
        newSpeech.subtitle = v.text
        newSpeech.synthesisConfig = {}

        speeches.push({ ...newSpeech })
      })
      material.speeches = speeches
      setSpeeches(speeches)
    } else {
      setSpeeches(material.speeches || [])
    }
  }

  async function fetchGraphicURLs() {
    return fetchWithAuth(`/graphics?lesson_id=${lesson.id}`)
      .catch(e => {
        if (e.response?.status === 404) return []
        throw e
      })
  }
}