import { fetchWithAuth, post } from './fetch'
import { extentionNameTo3Chars } from './utils'

export function fetchVoiceFileURL(voiceID, lessonID, option) {
  return fetchWithAuth(`/voices/${voiceID}?lesson_id=${lessonID}`, null, option)
}

export function createVoice(elapsedTime, durationSec, lessonID, option) {
  return post('/voice', { elapsedTime, durationSec, lessonID }, 'POST', null, option)
}

export function createGraphics(lessonID, files, option) {
  const requests = files.map(file => {
    return {
      entity: 'graphic',
      extension: extentionNameTo3Chars(file.type.substr(6)),
      contentType: file.type
    }
  })

  const request = { lessonID, fileRequests: requests }
  return post('/graphics', request, 'POST', null, option)
}