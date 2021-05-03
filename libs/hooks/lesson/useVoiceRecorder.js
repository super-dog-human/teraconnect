import { useRef, useState, useEffect } from 'react'
import useMicrophone from '../useMicrophone'
import useFetch from '../useFetch'
import { bufferToWavFile }  from '../../audioUtils'

export default function useVoiceRecorder({ needsUpload=true, lessonID, isRecording, realElapsedTime }) {
  const recorderRef = useRef()
  const uploaderRef = useRef()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [micDeviceID, setMicDeviceID] = useState()
  const [silenceThresholdSec, setSilenceThresholdSec] = useState(1.0)
  const [voiceFile, setVoiceFile] = useState()
  const { isMicReady, setNode } = useMicrophone()
  const { fetchToken } = useFetch()

  function switchRecording() {
    if (!recorderRef.current) return
    recorderRef.current.port.postMessage({ isRecording })
  }

  function terminalCurrentRecorder() {
    if (!recorderRef.current) return
    recorderRef.current.port.postMessage({ isTerminal: true })
  }

  function terminalUploader() {
    uploaderRef.current.postMessage({ isTerminal: true })
  }

  function handleRecorderMessage(command) {
    Object.keys(command).forEach(k => {
      switch(k) {
      case 'isSpeaking':
        setIsSpeaking(command[k])
        return
      case 'saveRecord':
        // データコピーが発生するが、AudioWorklet内でDedicated Workerを扱えないのでここから受け渡しをする
        if (needsUpload) {
          uploaderRef.current.postMessage({ newVoice: command[k] })
        } else {
          setVoiceFile(bufferToWavFile(command[k]))
        }
        return
      }
    })
  }

  function updateSilenceThresholdSec() {
    if(!recorderRef.current) return
    recorderRef.current.port.postMessage({ changeThreshold: silenceThresholdSec })
  }

  useEffect(() => {
    uploaderRef.current = new Worker('/voiceUploader.js')
    fetchToken().then(token => {
      uploaderRef.current.postMessage({ initialize: { lessonID, token, apiURL: process.env.NEXT_PUBLIC_TERACONNECT_API_URL } })
    })

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
      recorderRef.current = new AudioWorkletNode(ctx, 'recorder')
      if (needsUpload) {
        recorderRef.current.port.postMessage({ setElapsedTime: realElapsedTime() })
      } else {
        recorderRef.current.port.postMessage({ setIsSimpleMode: true })
      }
      recorderRef.current.port.onmessage = e => {
        handleRecorderMessage(e.data)
      }
      updateSilenceThresholdSec()
      micInput.connect(recorderRef.current)
      recorderRef.current.connect(ctx.destination)

      if (isRecording) switchRecording()
    })
  }, [micDeviceID])

  useEffect(() => {
    switchRecording()
  }, [isRecording])

  useEffect(() => {
    updateSilenceThresholdSec()
  }, [silenceThresholdSec])

  return { isMicReady, isSpeaking, micDeviceID, setMicDeviceID, silenceThresholdSec, setSilenceThresholdSec, voiceFile }
}