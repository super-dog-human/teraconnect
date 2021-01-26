import { useState, useEffect } from 'react'

let isMicReady = false
let stream
let micInput

export default function useMicrophone(micDeviceID) {
  const [audioCtx, setAudioCtx] = useState()

  async function initAudioContext() {
    if (typeof webkitAudioContext === 'undefined') {
      setAudioCtx(new AudioContext())
    } else {
      setAudioCtx(new webkitAudioContext()) // for safari
    }
  }

  async function initMicInput() {
    isMicReady = false

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
      initAudioContext() // getUserMediaの後に実行しないとChromeで警告が出る
    }
  }

  function terminalMicInput() {
    if (!stream) return
    stream.getAudioTracks().forEach(track => track.stop())

    if (!micInput) return
    micInput.disconnect()
    micInput = null
  }

  async function setNode(node) {
    terminalMicInput()
    await initMicInput()

    micInput = audioCtx.createMediaStreamSource(stream)
    micInput.connect(node)
    node.connect(audioCtx.destination)

    isMicReady = true
  }

  useEffect(() => {
    return terminalMicInput
  }, [])

  return { audioCtx, isMicReady, setNode }
}