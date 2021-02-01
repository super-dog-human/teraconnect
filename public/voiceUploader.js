importScripts('/lame.min.js', '/unfetch.js')

const numChannels = 1
const sampleRate = 44100
const bitRate = 128
const encodeBlockSize = 1152
let mp3Encoder
let uploadingCount = 0
let lessonID
let token
let apiURL

onmessage = async function(e) {
  Object.keys(e.data).forEach(async(k) => {
    switch(k) {
    case 'initialize': {
      lessonID = e.data.initialize.lessonID
      token = e.data.initialize.token
      apiURL = e.data.initialize.apiURL
      return
    }
    case 'newVoice': {
      uploadingCount += 1

      const result = await fetchSignedURL(e.data.newVoice.time, e.data.newVoice.durationSec)
      const file = await createMP3(e.data.newVoice.buffers)
      await uploadFile(result.signedURL, file)
      e.data = null

      uploadingCount -= 1

      return
    }
    case 'isTerminal':
      terminate()
      return
    }
  })
}

function floatTo16BitPCM(output, offset, input) {
  const isSetByIndex = output.constructor === Int16Array
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]))
    if (isSetByIndex) {
      output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF)
    } else {
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
  }
}

async function createMP3(rawData) {
  if (!mp3Encoder) {
    mp3Encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, bitRate)
  }

  const mp3Data = []
  rawData.forEach(raw => {
    const samples = new Int16Array(raw.length)
    floatTo16BitPCM(samples, null, raw)
    let remaining = samples.length
    for (var i = 0; remaining >= 0; i += encodeBlockSize) {
      var left = samples.subarray(i, i + encodeBlockSize)
      const mp3buf = mp3Encoder.encodeBuffer(left)
      mp3Data.push(new Int8Array(mp3buf))
      remaining -= encodeBlockSize
    }
  })

  mp3Data.push(new Int8Array(mp3Encoder.flush()))

  return new Blob(mp3Data, { type: 'audio/mpeg' })
}

async function fetchSignedURL(speeched, durationSec) {
  const url = apiURL + '/voice'
  const body = {
    speeched: parseFloat(speeched.toFixed(3)),
    durationSec: parseFloat(durationSec.toFixed(3)),
    lessonID,
  }
  const option = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }

  const response = await unfetch(url, option)
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
}

async function uploadFile(url, file) {
  const response = await unfetch(url, {
    method: 'PUT',
    header: { 'Content-Type': file.type },
    body: file,
  })
  if (!response.ok) throw new Error(response.statusText)
}

function terminate(tryCount=0) {
  if (uploadingCount === 0 || tryCount >= 12) {
    if (mp3Encoder) mp3Encoder.close()
    close()
  } else {
    setTimeout(() => {terminate(tryCount + 1)}, 5000)
  }
}