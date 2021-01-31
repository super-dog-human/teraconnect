import { useState, useEffect } from 'react'
import useMicrophone from '../../useMicrophone'

let recorder
let uploader

export default function useVoiceRecorder(id, token, isRecording, setRecord) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [micDeviceID, setMicDeviceID] = useState()
  const [silenceThresholdSec, setSilenceThresholdSec] = useState(0.6)
  const { isMicReady, setNode } = useMicrophone()

  function switchRecording() {
    if (!recorder) return
    recorder.port.postMessage({ isRecording })
  }

  function terminalCurrentRecorder() {
    if (!recorder) return
    recorder.port.postMessage({ isTerminal: true })
  }

  function terminalUploader() {
    uploader.postMessage({ isTerminal: true })
  }

  function handleRecorderMessage(command) {
    Object.keys(command).forEach(k => {
      switch(k) {
      case 'isSpeaking':
        setIsSpeaking(command[k])
        return
      case 'saveRecord':
        // データコピーが発生するが、AudioWorklet内でDedicated Workerを扱えないのでここから受け渡しをする
        uploader.postMessage({ newVoice: command[k] })
        return
      }
    })
  }

  function updateSilenceThresholdSec() {
    if(!recorder) return
    recorder.port.postMessage({ changeThreshold: silenceThresholdSec })
  }

  useEffect(() => {
    uploader = new Worker('/voiceUploader.js')
    // tokenをリフレッシュする場合は？
    uploader.postMessage({ initialize: { lessonID: id, token, apiURL: process.env.TERACONNECT_API_URL } })

    return () => {
      terminalCurrentRecorder()
      terminalUploader()
    }
  }, [])

  useEffect(() => {
    if (!micDeviceID) return

    terminalCurrentRecorder()

    setNode(micDeviceID, async(ctx, micInput) => {
      await ctx.audioWorklet.addModule('/voiceRecorderProcessor.js')
      recorder = new AudioWorkletNode(ctx, 'recorder')
      recorder.port.onmessage = e => {
        handleRecorderMessage(e.data)
      }
      updateSilenceThresholdSec()
      micInput.connect(recorder)
      recorder.connect(ctx.destination)

      if (isRecording) switchRecording()
    })
  }, [micDeviceID])

  useEffect(() => {
    switchRecording()
  }, [isRecording])

  useEffect(() => {
    updateSilenceThresholdSec()
  }, [silenceThresholdSec])

  return { isMicReady, isSpeaking, micDeviceID, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec }
}