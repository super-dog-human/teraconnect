import { fetchWithAuth } from './fetch'

export async function fetchMaterial({ lesson, setGraphics, setDrawings, setSpeeches, setTimeline }) {
  const material = await fetchWithAuth(`/lessons/${lesson.id}/materials`)
  setGraphics(material.graphics)
  setDrawings(material.drawings)
  setSpeeches(material.speeches)
  await setNewTimelines()

  async function setNewTimelines() {
    const timeline = {};
    ['avatar', 'graphic', 'drawing', 'speech'].forEach(kind => {
      if (!material[kind + 's']) return

      material[kind + 's'].forEach(m => {
        if (!timeline[m.elapsedtime]) timeline[m.elapsedtime] = {}
        timeline[m.elapsedtime][kind] =  m
      })
    })

    const conditions = [!material.speeches, lesson.needsRecording, material.version === 1, material.created === material.updated]
    if (conditions.every(v => v)) {
      await setTimelineWithVoices(timeline)
    } else {
      updateTimeline(timeline)
    }
  }

  async function setTimelineWithVoices(timeline) {
    const voices = await fetchWithAuth(`/voices?lesson_id=${lesson.id}`)
    voices.forEach(v => {
      if (!timeline[v.elapsedtime]) timeline[v.elapsedtime] = {}

      timeline[v.elapsedtime].speech = {
        voiceID : v.id,
        elapsedtime: v.elapsedtime,
        durationSec: v.durationSec,
        subtitle: v.text,
        caption: '',
      }
    })

    updateTimeline(timeline, setTimeout)
  }

  function updateTimeline(timeline) {
    const line = {} // Objectのソートはブラウザの実装依存なのでここで作り直す
    Object.keys(timeline).sort((a, b) => a - b).forEach(t => {
      line[t] = timeline[t]
    })
    setTimeline(line)
  }
}