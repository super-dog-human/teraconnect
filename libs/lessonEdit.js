import { filterObject } from './utils'
import { createTimeline } from './lessonLineUtils'

export async function fetchMaterial({ lesson, fetchWithAuth, setVoiceSynthesisConfig, setAvatars, setDrawings, setGraphics, setGraphicURLs, setMusics, setSpeeches }) {
  const material = await fetchWithAuth(`/lessons/${lesson.id}/materials`)
  setVoiceSynthesisConfig(material.voiceSynthesisConfig)
  setAvatars(material.avatars || [])
  await setGraphicsWithURL(material.graphics || [])
  setDrawings(material.drawings || [])
  setMusics(material.musics || [])
  await setSpeechWithVoice(material)
  return createTimeline(filterObject(material, ['avatars', 'drawings', 'graphics', 'speeches', 'musics']))

  async function setGraphicsWithURL(graphics) {
    const graphicURLs = await fetchGraphicURLs()
    setGraphicURLs(graphicURLs)

    const graphicsWithURLs = graphics.map(g => {
      g.url = graphicURLs[g.graphicID] // ここでgraphicsの元のmaterialも更新されている
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
    const results = await fetchWithAuth(`/graphics?lesson_id=${lesson.id}`)
      .catch(e => {
        if (e.response?.status === 404) return []
        throw e
      })

    return results.reduce((acc, r) => {
      acc[r.id] = r.url
      return acc
    }, {})
  }
}