import { fetchWithAuth } from './fetch'

const defaultSpeech = {
  isSynthesis: false,
}

export async function fetchMaterial({ lesson, setDurationSec, setVoiceSynthesisConfig, setAvatars, setDrawings, setGraphics, setMusics, setSpeeches }) {
  const material = await fetchWithAuth(`/lessons/${lesson.id}/materials`)
  setDurationSec(material.durationSec)
  setVoiceSynthesisConfig(material.voiceSynthesisConfig)
  setAvatars(material.avatars || [])
  setGraphics(material.graphics || [])
  setDrawings(material.drawings || [])
  setMusics(material.musics || [])
  setSpeeches(material.speeches || [])
  return createNewTimelines()

  function createNewTimelines() {
    const timeline = {};
    ['avatar', 'graphic', 'drawing', 'speech', 'music'].forEach(kind => {
      if (!material[kind + 's']) return

      material[kind + 's'].forEach(m => {
        const elapsedtime = m.elapsedtime
        if (!timeline[elapsedtime]) {
          timeline[elapsedtime] = {}
        }
        delete m.elapsedtime // キーにelapsedtimeが入るので不要
        if (timeline[elapsedtime][kind]) {
          timeline[elapsedtime][kind].push(m)
        } else {
          timeline[elapsedtime][kind] = [m]
        }
      })
    })

    const conditions = [!material.speeches, lesson.needsRecording, material.version === 1, material.created === material.updated]
    if (conditions.every(v => v)) {
      return timelineWithVoices(timeline)
    } else {
      return timeline
    }
  }

  async function timelineWithVoices(timeline) {
    const voices = await fetchWithAuth(`/voices?lesson_id=${lesson.id}`)
      .catch(e => {
        if (e.response?.status === 404) return []
        throw e
      })

    voices.forEach(v => {
      if (!timeline[v.elapsedtime]) timeline[v.elapsedtime] = {}

      const newSpeech = { ...defaultSpeech }
      newSpeech.caption = {}
      newSpeech.voiceID = v.id
      newSpeech.durationSec = v.durationSec
      newSpeech.subtitle = v.text
      newSpeech.synthesisConfig = {}

      timeline[v.elapsedtime].speech = [newSpeech]
      setSpeeches(speeches => {
        newSpeech.elapsedtime = v.elapsedtime
        speeches.push(newSpeech)
        return speeches
      })
    })

    return timeline
  }
}

export async function fetchGraphicURLs(lessonID) {
  const results = await fetchWithAuth(`/graphics?lesson_id=${lessonID}`)
    .catch(e => {
      if (e.response?.status === 404) return []
      throw e
    })

  return results.reduce((acc, r) => {
    acc[r.id] = r.url
    return acc
  }, {})
}