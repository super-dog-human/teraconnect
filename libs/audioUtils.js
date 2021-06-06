const numChannels = 1
const lamejs = require('lamejs')

export function bufferToWavFile({ buffers, sampleRate }) {
  const mergedBuffers = mergeBuffers(buffers)
  const dataview = encodeWAV(mergedBuffers, sampleRate)
  return new Blob([dataview], { type: 'audio/wav' })

  function mergeBuffers(buffers) {
    const resampledResult = []
    let resampledLength = 0
    buffers.forEach(buffer => {
      resampledResult.push(buffer)
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

  function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
  }
}

export async function wavToMp3(file) {
  const audioBuffer = await file.arrayBuffer()
  const wav = lamejs.WavHeader.readHeader(new DataView(audioBuffer))
  const samples = new Int16Array(audioBuffer, wav.dataOffset, wav.dataLen / 2)

  const bitRate = 128
  const numChannels = wav.channels
  const sampleRate = wav.sampleRate
  const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, bitRate)

  const mp3Data = []
  const encodeBlockSize = 1152
  for (var i = 0; i < samples.length; i += encodeBlockSize) {
    const sampleChunk = samples.subarray(i, i + encodeBlockSize)
    const mp3buf = mp3encoder.encodeBuffer(sampleChunk)
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }
  }

  const mp3buf = mp3encoder.flush()
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf)
  }

  return new Blob(mp3Data, { type: 'audio/mpeg' })
}