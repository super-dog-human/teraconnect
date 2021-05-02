import { fetchWithAuth, post } from './fetch'

export function fetchVoiceFileURL(voiceID, lessonID, option) {
  return fetchWithAuth(`/voices/${voiceID}?lesson_id=${lessonID}`, null, option)
}

export async function createVoice(elapsedTime, durationSec, lessonID, option) {
  return await post('/voice', { elapsedTime, durationSec, lessonID }, 'POST', null, option)
}
