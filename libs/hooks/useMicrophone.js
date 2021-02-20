import { useState, useEffect } from 'react'
import { useDialogContext } from '../contexts/dialogContext'

let audioCtx
let stream
let micInput

export default function useMicrophone() {
  const [isMicReady, setIsMicReady] = useState(false)
  const { showDialog } = useDialogContext()

  function initAudioContext() {
    audioCtx = typeof webkitAudioContext === 'undefined' ?
      new AudioContext({ latencyHint: 'balanced' }) : new webkitAudioContext() // for safari
  }

  async function initMicInput(micDeviceID) {
    if (!audioCtx) initAudioContext()

    if (audioCtx.state === 'running') {
      await connectMic(micDeviceID)
    } else {
      return new Promise(resolve => {
        showDialog({
          title: 'マイク使用の確認',
          message: 'この画面では端末のマイクを使用します。よろしいですか？',
          canDismiss: true,
          dismissName: 'キャンセル',
          callbackName: '許可',
          callback: async () => {
            await audioCtx.resume()
            await connectMic(micDeviceID)
            resolve()
          },
        })
      })
    }
  }

  async function connectMic(micDeviceID) {
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