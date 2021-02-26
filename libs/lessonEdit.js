import { fetchWithAuth } from './fetch'

export async function fetchMaterial({ lesson, setAvatars, setDrawings, setGraphics, setSpeeches }) {
  const material = await fetchWithAuth(`/lessons/${lesson.id}/materials`)
  setAvatars(material.avatars)
  setGraphics(material.graphics)
  setDrawings(material.drawings)
  setSpeeches(material.speeches)
  return createNewTimelines()

  function createNewTimelines() {
    const timeline = {};
    ['avatar', 'graphic', 'drawing', 'speech', 'music'].forEach(kind => {
      if (!material[kind + 's']) return

      material[kind + 's'].forEach(m => {
        if (!timeline[m.elapsedtime]) {
          timeline[m.elapsedtime] = {}
        }
        if (timeline[m.elapsedtime][kind]) {
          timeline[m.elapsedtime][kind].push(m)
        } else {
          timeline[m.elapsedtime][kind] = [m]
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

      timeline[v.elapsedtime].speech = [{
        voiceID : v.id,
        elapsedtime: v.elapsedtime,
        durationSec: v.durationSec,
        subtitle: v.text,
        caption: '',
        url: v.url,
      }]
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