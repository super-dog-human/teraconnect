import { useRef, useState, useCallback, useEffect } from 'react'
import { useDialogContext } from '../contexts/dialogContext'

export default function useMicrophone() {
  const audioCtxRef = useRef()
  const streamRef = useRef()
  const micInputRef = useRef()
  const [isMicReady, setIsMicReady] = useState(false)
  const { showDialog } = useDialogContext()

  function initAudioContext() {
    audioCtxRef.current = typeof webkitAudioContext === 'undefined' ?
      new AudioContext({ latencyHint: 'balanced' }) : new webkitAudioContext() // for safari
  }

  const initMicInput = useCallback(async micDeviceID => {
    if (!audioCtxRef.current) initAudioContext()

    if (audioCtxRef.current.state === 'running') {
      await connectMic(micDeviceID)
    } else {
      return new Promise(resolve => {
        showDialog({
          title: 'マイクの使用',
          message: 'この画面では端末のマイクを使用します。よろしいですか？',
          canDismiss: true,
          dismissName: 'キャンセル',
          callbackName: '許可',
          callback: async () => {
            await audioCtxRef.current.resume()
            await connectMic(micDeviceID)
            resolve()
          },
        })
      })
    }
  }, [showDialog])

  async function connectMic(micDeviceID) {
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
        deviceId: micDeviceID,
      },
      video: false,
    })

    micInputRef.current = audioCtxRef.current.createMediaStreamSource(streamRef.current)
  }

  async function terminalMicInput() {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.stop())
    }

    if (micInputRef.current) {
      micInputRef.current.disconnect()
      micInputRef.current = null
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      await audioCtxRef.current.close()
    }

    if (audioCtxRef.current) {
      audioCtxRef.current = null
    }
  }

  const setNode = useCallback(async (micDeviceID, callback) => {
    setIsMicReady(false)

    await terminalMicInput()
    await initMicInput(micDeviceID)
    await callback(audioCtxRef.current, micInputRef.current)

    setIsMicReady(true)
  }, [initMicInput])

  useEffect(() => {
    return terminalMicInput
  }, [])

  return { isMicReady, setNode }
}