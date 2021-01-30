importScripts('/lame.min.js')

const numChannels = 1
let mp3Encoder
const kbps = 128
const encodeBlockSize = 1152

onmessage = async function(e) {
  let createdCount = 0
  createMP3(e.data.buffers, e.data.bufferLength, e.data.sampleRate)
    .then(file => {
      self.postMessage(file)
      createdCount += 1
      if (createdCount) e.data.buffers = null
    })

  /*
  createWAV(e.data.buffers, e.data.sampleRate)
    .then(file => {
      self.postMessage(file)
      createdCount += 1
      if (createdCount) e.data.buffers = null
    })
  */

  /*
  const axios = require('axios')

  const voice = event.data
  const params = { lesson_id: voice.lessonID }
  axios
    .post(voice.url, params)
    .then(response => {
      return response.data
    })
    .then(response => {
      const fileID = response.file_id
      voice.fileID = fileID
      const putURL = response.signed_url

      const recordSampleRate = voice.currentSampleRate
      const audioBuffer = createWAVFile(voice.buffers, recordSampleRate)

      const instance = axios.create({
        transformRequest: [
          (data, header) => {
            header.put['Content-Type'] = 'audio/wav'
            return data
          }
        ]
      })

      return instance.put(putURL, audioBuffer)
    })
    .catch(error => {
      console.error(error)
      voice.error = error
    })
    .then(() => {
      self.postMessage(voice)
    })
    */

// close()
// encoder.close()
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
  const mergedBuffers = mergeBuffers(buffers, recordSampleRate)
  const dataview = encodeWAV(mergedBuffers, recordSampleRate)
  const audioBlob = new Blob([dataview], { type: 'audio/wav' })
  return audioBlob

  function mergeBuffers(buffers, recordSampleRate) {
    const resampledResult = []
    let resampledLength = 0
    buffers.forEach(buffer => {
      //            const resampledBuffer = downSampling(buffer, recordSampleRate);
      //            resampledResult.push(resampledBuffer);
      resampledResult.push(buffer)
      //            resampledLength += resampledBuffer.length;
      resampledLength += buffer.length
    })

    const result = new Float32Array(resampledLength)
    let offset = 0
    resampledResult.forEach(buffer => {
      result.set(buffer, offset)
      offset += buffer.length
    })

    return result
  }

  function encodeWAV(buffers, recordSampleRate) {
    const buffer = new ArrayBuffer(44 + buffers.length * 2)
    let view = new DataView(buffer)

    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + buffers.length * 2, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, recordSampleRate, true)
    view.setUint32(28, recordSampleRate * numChannels * 2, true)
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

  /*
    function downSampling(buffer, recordSampleRate) {
        const compression = recordSampleRate / 16000;
        const resampledLength = parseInt(buffer.length / compression);
        const resampledBuffer = new Float32Array(resampledLength);

        let loopIndex = 0;
        while (loopIndex < resampledLength) {
            const bufferIndex = Math.round(loopIndex * compression);
            if (!buffer[bufferIndex]) { console.error('empty audio buffer!'); }
            resampledBuffer[loopIndex] = buffer[bufferIndex];
            loopIndex ++;
        }

        return resampledBuffer;
    }
*/
}