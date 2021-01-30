import { useState, useEffect } from 'react'

let audioCtx
let stream
let micInput

export default function useMicrophone() {
  const [isMicReady, setIsMicReady] = useState(false)

  function initAudioContext() {
    audioCtx = typeof webkitAudioContext === 'undefined' ? new AudioContext() : new webkitAudioContext() // for safari
  }

  async function initMicInput(micDeviceID) {
    if (!audioCtx) initAudioContext()

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
        deviceId: micDeviceID,
      },
      video: false,
    })

    micInput = audioCtx.createMediaStreamSource(stream)
  }

  async function terminalMicInput() {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.stop())
    }

    if (micInput) {
      micInput.disconnect()
      micInput = null
    }

    if (audioCtx && audioCtx.state != 'closed') {
      await audioCtx.close()
    }

    if (audioCtx) {
      audioCtx = null
    }
  }

  async function setNode(micDeviceID, callback) {
    setIsMicReady(false)

    await terminalMicInput()
    await initMicInput(micDeviceID)
    await callback(audioCtx, micInput)

    setIsMicReady(true)
  }

  useEffect(() => {
    return terminalMicInput
  }, [])

  return { isMicReady, setNode }
}