import { fetchWithAuth } from './fetch'

export async function fetchMaterial({ lesson, setGraphics, setDrawings, setSpeeches }) {
  const material = await fetchWithAuth(`/lessons/${lesson.id}/materials`)
  setGraphics(material.graphics)
  setDrawings(material.drawings)
  setSpeeches(material.speeches)
  return createNewTimelines()

  function createNewTimelines() {
    const timeline = {};
    ['avatar', 'graphic', 'drawing', 'speech'].forEach(kind => {
      if (!material[kind + 's']) return

      material[kind + 's'].forEach(m => {
        if (!timeline[m.elapsedtime]) timeline[m.elapsedtime] = {}
        timeline[m.elapsedtime][kind] = m
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
    voices.forEach(v => {
      if (!timeline[v.elapsedtime]) timeline[v.elapsedtime] = {}

      timeline[v.elapsedtime].speech = {
        voiceID : v.id,
        elapsedtime: v.elapsedtime,
        durationSec: v.durationSec,
        subtitle: v.text,
        caption: '',
        url: v.url,
      }
    })

    return timeline
  }
}