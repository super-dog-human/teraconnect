import { filterObject } from './utils'
import { createTimeline } from './lessonLineUtils'

export async function fetchMaterial({ lesson, fetchWithAuth, setVoiceSynthesisConfig, setBgImageURL, setAvatars, setDrawings, setGraphics, setGraphicURLs, setMusics, setSpeeches }) {
  const material = await fetchWithAuth(`/lessons/${lesson.id}/materials`)
  setBgImageURL(material.backgroundImageURL)
  setVoiceSynthesisConfig(material.voiceSynthesisConfig)
  setAvatars(material.avatars || [])
  await setGraphicsWithURL(material.graphics || [])
  setDrawings(material.drawings || [])
  setMusics(material.musics || [])
  await setSpeechWithVoice(material)
  return createTimeline(filterObject(material, ['avatars', 'drawings', 'graphics', 'speeches', 'musics']))

  async function setGraphicsWithURL(graphics) {
    const graphicURLs = (await fetchGraphicURLs()).reduce((acc, r) => {
      acc[r.id] = {
        url: r.url,
        isUploading: false,
      }
      return acc
    }, {})

    setGraphicURLs(graphicURLs)

    const graphicsWithURLs = graphics.map(g => {
      if (g.action === 'show') {
        g.url = graphicURLs[g.graphicID].url // ここでgraphicsの元のmaterialも更新されている
      }
      return g
    })
    setGraphics(graphicsWithURLs)
  }

  async function setSpeechWithVoice(material) {
    const conditions = [!material.speeches, lesson.needsRecording, material.version === 1, material.created === material.updated]
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
      setSpeeches(material.speech || [])
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