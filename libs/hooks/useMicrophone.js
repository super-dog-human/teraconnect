import { useState, useEffect } from 'react'

let audioCtx
let stream
let micInput

export default function useMicrophone() {
  const [isMicReady, setIsMicReady] = useState(false)

  async function initAudioContext() {
    audioCtx= (typeof webkitAudioContext === 'undefined') ? new AudioContext() : new webkitAudioContext() // for safari
  }

  async function initMicInput(micDeviceID) {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
        deviceId: micDeviceID,
      },
      video: false
    })

    if (!audioCtx) {
      await initAudioContext() // getUserMediaの後に実行しないとChromeで警告が出る
    }

    micInput = audioCtx.createMediaStreamSource(stream)
  }

  function terminalMicInput() {
    if (!stream) return
    stream.getAudioTracks().forEach(track => track.stop())

    if (!micInput) return
    micInput.disconnect()
    micInput = null
  }

  async function setNode(micDeviceID, callback) {
    setIsMicReady(false)

    terminalMicInput()
    await initMicInput(micDeviceID)
    await callback(audioCtx, micInput)

    setIsMicReady(true)
  }

  useEffect(() => {
    return terminalMicInput
  }, [])

  return { isMicReady, setNode }
}