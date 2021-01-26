import { useState, useEffect } from 'react'

let micDeviceID
let isReady = false
let stream
let audioCtx
let micInput
let recorder

export default function useVoiceRecorder(id, token, isRecording, setRecord) {
  const [isTalking, setIsTalking] = useState(false)
  const [config, setConfig] = useState({
    silenceSecondThreshold: 0.6,

  })

  function start() {
    if (isReady) {
      recorder.port.postMessage({ isRecording: isRecording })
    } else {
      setTimeout(() => {
        start()
      }, 1000)
    }
  }

  function uploadVoice(result) {
    /*
    const callback = (voice => {
      setRecord('voice', voice)
    }, talking => {
      setIsTalking(talking)
    )

    const voice = {
      timeSec: result.speechedAt,
      durationSec: result.durationSec
    }
    callback(voice)

    const uploader = new Worker('voiceUploader.js')
    uploader.postMessage({
        url: Const.RAW_VOICE_API_URL,
        lessonID: id,
        time: result.speechedAt,
        buffers: result.buffers,
        bufferLength: result.bufferLength,
        currentSampleRate: this._audioCtx.sampleRate
    })

    uploader.onmessage = (event => {
        voice.fileID = event.data.fileID
        callback(voice)
        uploader.terminate()
    })
    */
  }

  async function initMicInput() {
    isReady = false

    if (!audioCtx) await initAudioWorklet()

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
        deviceId: micDeviceID,
      },
      video: false
    })

    micInput = audioCtx.createMediaStreamSource(stream)
    micInput.connect(recorder)
    recorder.connect(audioCtx.destination)

    isReady = true
  }

  async function initAudioWorklet() {
    audioCtx = typeof webkitAudioContext === 'undefined' ? new AudioContext() : new webkitAudioContext() // for safari
    await audioCtx.audioWorklet.addModule('/voiceRecorderProcessor.js')
    recorder = new AudioWorkletNode(audioCtx, 'recorder')
    recorder.port.onmessage = e => {
      uploadVoice(e.data)
    }
  }

  function terminalMicInput() {
    if (!stream) return

    stream.getAudioTracks().forEach(track => track.stop())
    micInput.disconnect()
    micInput = null
  }

  useEffect(() => {
    return terminalMicInput
  }, [])


  useEffect(() => {
    start()
  }, [isRecording])

  useEffect(() => {
    if (config.micDeviceID) {
      micDeviceID = config.micDeviceID
      terminalMicInput()
      initMicInput()
    }

    // set volume threshold
  }, [config])

  return { isTalking, setVoiceRecorderConfig: setConfig }
}