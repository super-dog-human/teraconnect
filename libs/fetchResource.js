import { fetchWithAuth } from './fetch'

export function fetchVoiceFileURL(voiceID, lessonID) {
  return fetchWithAuth(`/voices/${voiceID}?lesson_id=${lessonID}`)
    .then(result => result)
    .catch(e  => {
      console.error(e)
    })
}