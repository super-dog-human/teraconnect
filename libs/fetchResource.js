import { fetchWithAuth, post } from './fetch'

export function fetchVoiceFileURL(voiceID, lessonID) {
  return fetchWithAuth(`/voices/${voiceID}?lesson_id=${lessonID}`)
    .then(result => result)
    .catch(e  => {
      console.error(e)
    })
}

export async function createVoice(elapsedTime, durationSec, lessonID) {
  return await post('/voice', { elapsedTime, durationSec, lessonID })
}
