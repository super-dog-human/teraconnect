importScripts('/lame.min.js')
//import { post, putFile } from '../../../fetch'

const numChannels = 1
const wavSampleRate = 44100
const kbps = 128
const encodeBlockSize = 1152
let mp3Encoder
let uploadingCount = 0
let lessonID
let token

onmessage = async function(e) {
  Object.keys(e.data).forEach(k => {
    switch(k) {
    case 'initialize': {
      lessonID = e.data.initialize.lessonID
      token = e.data.initialize.token
      return
    }
    case 'newVoice': {
      uploadingCount += 1
      let completedMp3 = false
      let completedWav = false

      createMP3(e.data.newVoice.buffers, e.data.newVoice.bufferLength, e.data.newVoice.sampleRate)
        .then(file => {
          uploadFile('voice', file)
          completedMp3 = true
          completeUploading(completedMp3, completedWav, e.data)
        })

      createWAV(e.data.newVoice.buffers, e.data.newVoice.sampleRate)
        .then(file => {
          uploadFile('stt', file)
          completedWav = true
          completeUploading(completedMp3, completedWav, e.data)
        })

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

async function createMP3(rawData, bufferLength, sampleRate) {
  if (!mp3Encoder) {
    mp3Encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps)
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

  return new Blob(mp3Data, { type: 'audio/mp3' })
}

function createWAV(buffers, recordSampleRate) {
  return new Promise(resolve => {
    const mergedBuffers = mergeBuffers(buffers, recordSampleRate)
    const dataview = encodeWAV(mergedBuffers)
    const audioBlob = new Blob([dataview], { type: 'audio/wav' })
    resolve(audioBlob)
  })

  function mergeBuffers(buffers, recordSampleRate) {
    const resampledResult = []
    let resampledLength = 0
    buffers.forEach(buffer => {
      const resampledBuffer = downSampling(buffer, recordSampleRate)
      resampledResult.push(resampledBuffer)
      resampledLength += resampledBuffer.length
    })

    const result = new Float32Array(resampledLength)
    let offset = 0
    resampledResult.forEach(buffer => {
      result.set(buffer, offset)
      offset += buffer.length
    })

    return result
  }

  function encodeWAV(buffers) {
    const buffer = new ArrayBuffer(44 + buffers.length * 2)
    let view = new DataView(buffer)

    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + buffers.length * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, wavSampleRate, true)
    view.setUint32(28, wavSampleRate * numChannels * 2, true)
    view.setUint16(32, numChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(view, 36, 'data')
    view.setUint32(40, buffers.length * 2, true)
    floatTo16BitPCM(view, 44, buffers)

    return view
  }

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  function downSampling(buffer, recordSampleRate) {
    const compression = recordSampleRate / wavSampleRate
    const resampledLength = parseInt(buffer.length / compression)
    const resampledBuffer = new Float32Array(resampledLength)

    let loopIndex = 0
    while (loopIndex < resampledLength) {
      const bufferIndex = Math.round(loopIndex * compression)
      if (!buffer[bufferIndex]) { console.error('empty audio buffer!') }
      resampledBuffer[loopIndex] = buffer[bufferIndex]
      loopIndex ++
    }

    return resampledBuffer
  }
}

async function uploadFile(type, file) {
  switch(type) {
  case 'voice': {
    const contentType = 'audio/mpeg'
    const file = {
      entity: 'voice',
      extension: 'mp3',
      contentType,
    }
    /*
    const request = { fileRequests: [file] }
    const result = await post('/graphics', request, token)
    const signedURL = result.signedURLs
    //    uploade(validFiles[i], temporaryIDs[i], r.fileID, r.signedURL)

    putFile(signedURL, file, contentType)
    */
    return
  }
  case 'stt': {
    // audio/wav
    return
  }
  }
}

function completeUploading(completedMp3, completedWav, data) {
  if (!completedWav || !completedMp3) return
  data = null // メモリ解放
  uploadingCount -= 1
}

function terminate(tryCount=0) {
  if (uploadingCount === 0 || tryCount >= 12) {
    if (mp3Encoder) mp3Encoder.close()
    close()
  } else {
    setTimeout(() => {terminate(tryCount + 1)}, 5000)
  }
}